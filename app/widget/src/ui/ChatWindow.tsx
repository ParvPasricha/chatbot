import { useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { InputBar } from './InputBar';
import { useChat } from '../hooks/useChat';
import { defaultTheme } from '../utils/theme';

export const ChatWindow = ({ tenantId }: { tenantId: string }) => {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: 'Hey there! How can I help you today?' },
  ]);
  const { sendMessage, loading } = useChat(tenantId, (reply) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: reply }]);
  });

  const handleSend = async (message: string) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: message }]);
    await sendMessage(message);
  };

  return (
    <div style={{ width: 320, borderRadius: 20, overflow: 'hidden', boxShadow: defaultTheme.shadow }}>
      <header style={{ background: defaultTheme.primary, color: '#fff', padding: 12 }}>AI Assistant</header>
      <div style={{ background: '#f9fafb', padding: 16, minHeight: 260, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((message) => (
          <MessageBubble key={message.id} role={message.role as 'user' | 'assistant'} content={message.content} />
        ))}
      </div>
      <InputBar onSend={handleSend} disabled={loading} />
    </div>
  );
};
