import React from 'react';

export default function ChatMessage({ message }) {
  const isSystem = message.role === 'system';
  
  return (
    <div className={`flex mb-4 ${isSystem ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isSystem 
            ? 'bg-gray-100 text-gray-800' 
            : 'bg-primary-500 text-white'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
