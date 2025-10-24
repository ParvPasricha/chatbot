const dangerousPatterns = [
  /<script.*?>.*?<\/script>/gi,
  /(\b)(select|insert|update|delete|drop|alter)(\b)/gi,
];

export const sanitizeInput = (input: string): string => {
  let sanitized = input.trim();
  for (const pattern of dangerousPatterns) {
    sanitized = sanitized.replace(pattern, '');
  }
  return sanitized;
};
