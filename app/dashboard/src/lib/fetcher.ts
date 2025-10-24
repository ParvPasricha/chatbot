export const fetcher = async (url: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}${url}`);
  if (!response.ok) {
    throw new Error('Request failed');
  }
  return response.json();
};
