import React from 'react';
import { ChevronDown, ChevronRight, Clock, File } from 'lucide-react';

interface ChatData {
  name: string;
  created_at: string;
  chat_messages: Array<{
    sender: string;
    text: string;
    created_at: string;
    attachments?: Array<{
      file_name: string;
      file_size: number;
      extracted_content: string;
    }>;
  }>;
}

const DocumentContent = ({ content }: { content: string }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="mt-2">
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
      >
        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        {expanded ? 'Hide content' : 'Show content'}
      </button>
      {expanded && (
        <div className="mt-2 p-4 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap font-mono overflow-auto max-h-[500px]">
          {content}
        </div>
      )}
    </div>
  );
};

const ChatViewer = ({ initialData }: { initialData: ChatData }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  // Function to preserve newlines while removing excess whitespace
  const formatMessageText = (text: string) => {
    // Replace single newlines with <br/> and preserve double newlines as paragraphs
    return text.split('\n\n').map((paragraph, i) => (
      <p key={i} className="mb-4 last:mb-0">
        {paragraph.split('\n').map((line, j) => (
          <React.Fragment key={j}>
            {line}
            {j !== paragraph.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  const Message = ({ message }: { message: ChatData['chat_messages'][0] }) => {
    const [expanded, setExpanded] = React.useState(false);
    
    return (
      <div className="py-8 px-4 border-b border-gray-200 first:pt-4 last:border-0">
        <div className="flex items-start gap-4 max-w-4xl mx-auto">
          {/* Sender icon/avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium">
              {message.sender === 'human' ? 'H' : 'A'}
            </span>
          </div>

          {/* Message content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <span className="font-medium">
                {message.sender === 'human' ? 'Human' : 'Assistant'}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(message.created_at)}
              </span>
            </div>

            {/* Text content */}
            <div className="prose prose-sm max-w-none space-y-4">
              {formatMessageText(message.text)}
            </div>

            {/* Attachments */}
            {message.attachments?.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                  <button 
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1 hover:text-gray-900"
                  >
                    {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    {message.attachments.length} Attachment{message.attachments.length !== 1 ? 's' : ''}
                  </button>
                </div>

                {expanded && (
                  <div className="space-y-4">
                    {message.attachments.map((attachment, i) => (
                      <div key={i} className="border rounded p-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <File className="w-4 h-4 text-gray-500" />
                          <span>{attachment.file_name}</span>
                          <span className="text-gray-500">
                            ({attachment.file_size ? `${Math.round(attachment.file_size / 1024)}kb` : 'size unknown'})
                          </span>
                        </div>
                        {attachment.extracted_content && (
                          <DocumentContent content={attachment.extracted_content} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold">{initialData.name}</h1>
        <div className="text-sm text-gray-500 mt-1">
          Created: {formatDate(initialData.created_at)}
        </div>
      </div>

      {/* Messages */}
      <div className="divide-y divide-gray-200">
        {initialData.chat_messages.map((message, i) => (
          <Message key={i} message={message} />
        ))}
      </div>
    </div>
  );
};

export default ChatViewer;
