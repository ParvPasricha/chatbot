export const sendInboxMessage = async (tenantId: string, payload: Record<string, unknown>) => ({
  id: `${tenantId}-inbox-${Date.now()}`,
  ...payload,
});
