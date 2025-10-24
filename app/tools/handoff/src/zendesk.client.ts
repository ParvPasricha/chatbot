export const createZendeskTicket = async (tenantId: string, reason: string) => ({
  id: `${tenantId}-zendesk-${Date.now()}`,
  reason,
});
