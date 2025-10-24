export const createIntercomConversation = async (tenantId: string, reason: string) => ({
  id: `${tenantId}-intercom-${Date.now()}`,
  reason,
});
