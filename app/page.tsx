'use client';
import { useState } from 'react';
import ChatViewer from '../components/ChatViewer';

export default function Home() {
  const [jsonContent, setJsonContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      console.log('Loading file:', file.name);
      
      const text = await file.text();
      console.log('File content loaded, length:', text.length);
      
      const parsed = JSON.parse(text);
      console.log('JSON parsed successfully:', parsed);
      
      setJsonContent(text);
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err instanceof Error ? err.message : 'Error processing file');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-xl font-semibold mb-4">Chat Viewer</h1>
        <label className="block">
          <span className="text-gray-700">Select a chat JSON file:</span>
          <input
            type="file"
            accept=".json,.txt"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </label>
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>

      {jsonContent && (
        <div className="mt-8">
          <ChatViewer initialData={JSON.parse(jsonContent)} />
        </div>
      )}
    </main>
  );
}
