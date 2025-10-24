interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export const MessageBubble = ({ role, content }: MessageBubbleProps) => (
  <div
    style={{
      alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
      background: role === 'user' ? '#2563eb' : '#e5e7eb',
      color: role === 'user' ? '#fff' : '#111827',
      padding: '10px 14px',
      borderRadius: 16,
      maxWidth: 240,
    }}
  >
    {content}
  </div>
);
