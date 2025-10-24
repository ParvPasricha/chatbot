import { useState } from 'react';
import { sendMessage as sendChatMessage } from '../utils/apiClient';

export const useChat = (tenantId: string, onReply: (reply: string) => void) => {
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    setLoading(true);
    try {
      const response = await sendChatMessage({ tenantId, message });
      onReply(response.reply ?? 'Thanks for reaching out!');
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};
