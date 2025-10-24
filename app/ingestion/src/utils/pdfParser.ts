import pdf from 'pdf-parse';

export const parsePdf = async (buffer: Buffer): Promise<string> => {
  const { text } = await pdf(buffer);
  return text;
};
