const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL ?? 'http://localhost:4000';

const fallbackUuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
  const r = Math.random() * 16 | 0;
  const v = char === 'x' ? r : (r & 0x3) | 0x8;
  return v.toString(16);
});

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return fallbackUuid();
};

interface SendMessagePayload {
  tenantId: string;
  message: string;
}

export const sendMessage = async ({ tenantId, message }: SendMessagePayload) => {
  const conversationId = generateId();
  const response = await fetch(`${gatewayUrl}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer demo',
      'x-tenant-id': tenantId,
    },
    body: JSON.stringify({ tenantId, conversationId, message }),
  });
  if (!response.ok) {
    throw new Error('Chat request failed');
  }
  const payload = await response.json();
  return payload.data ?? payload;
};
