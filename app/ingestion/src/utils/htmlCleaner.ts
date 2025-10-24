import { load } from 'cheerio';

export const cleanHtml = (html: string) => {
  const $ = load(html);
  $('script, style, noscript').remove();
  return $('body').text().replace(/\s+/g, ' ').trim();
};
