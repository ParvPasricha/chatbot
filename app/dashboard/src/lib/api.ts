const baseUrl = process.env.NEXT_PUBLIC_GATEWAY_URL ?? 'http://localhost:4000';

export const api = {
  get: async (path: string) => {
    const response = await fetch(`${baseUrl}${path}`);
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  },
  post: async (path: string, body: Record<string, unknown>) => {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  },
};
