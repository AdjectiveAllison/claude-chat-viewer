import json
import argparse
from datetime import datetime
from typing import Dict, List


def sanitize_message(msg: Dict) -> Dict:
    """Remove sensitive and unnecessary fields from a message."""
    # Create a new dict with only the fields we want to keep
    sanitized = {
        "text": msg["text"],
        "sender": msg["sender"],
        "created_at": msg["created_at"],
        "updated_at": msg["updated_at"],
    }

    # Copy attachments if they exist, removing unnecessary fields
    if "attachments" in msg:
        sanitized["attachments"] = [
            {
                "file_name": att["file_name"],
                "file_type": att["file_type"],
                "file_size": att.get("file_size"),
                "extracted_content": att.get("extracted_content"),
            }
            for att in msg["attachments"]
        ]

    # Copy files if they exist, removing unnecessary fields
    if "files" in msg:
        sanitized["files"] = [{"file_name": file["file_name"]} for file in msg["files"]]

    return sanitized


def sort_chat_messages(json_data: Dict) -> List[Dict]:
    """Extract and sort chat messages, removing sensitive data."""
    # Extract and sanitize messages
    messages = [sanitize_message(msg) for msg in json_data.get("chat_messages", [])]

    # Sort by created_at timestamp
    return sorted(
        messages,
        key=lambda x: datetime.fromisoformat(x["created_at"].replace("Z", "+00:00")),
    )


def format_message(msg: Dict) -> str:
    """Format a message for display with timestamp, sender, and preview."""
    timestamp = datetime.fromisoformat(msg["created_at"].replace("Z", "+00:00"))
    text_preview = msg["text"][:100] + "..." if len(msg["text"]) > 100 else msg["text"]
    return f"{timestamp.isoformat()} | {msg['sender']:<9} | {text_preview}"


def save_sorted_chat(sorted_messages: List[Dict], output_file: str) -> None:
    """Save the sorted and sanitized messages to a new JSON file."""
    # Create minimal output structure
    output_json = {
        "name": "Chat Export",
        "created_at": sorted_messages[0]["created_at"] if sorted_messages else None,
        "updated_at": sorted_messages[-1]["updated_at"] if sorted_messages else None,
        "chat_messages": sorted_messages,
    }

    # Write to new file
    with open(output_file, "w") as f:
        json.dump(output_json, f, indent=2)


def process_chat_json(input_file: str, output_file: str) -> None:
    """Process the chat JSON, sort messages, remove sensitive data, and save."""
    # Read the input JSON
    with open(input_file, "r") as f:
        json_data = json.load(f)

    # Sort and sanitize messages
    sorted_messages = sort_chat_messages(json_data)

    # Save sanitized version
    save_sorted_chat(sorted_messages, output_file)

    # Print preview
    print(f"Total messages: {len(sorted_messages)}")
    print(f"\nSanitized and sorted messages saved to: {output_file}")
    print("\nPreview of chronological order:")
    print("-" * 120)

    for msg in sorted_messages:
        print(format_message(msg))
        print("-" * 120)


def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(
        description="Process a chat JSON file to sort messages and remove sensitive data"
    )
    parser.add_argument(
        "input_file", help="Path to the input JSON file containing chat messages"
    )
    parser.add_argument(
        "output_file", help="Path where the processed JSON file will be saved"
    )

    # Parse arguments
    args = parser.parse_args()

    # Process the chat file
    process_chat_json(args.input_file, args.output_file)


if __name__ == "__main__":
    main()
