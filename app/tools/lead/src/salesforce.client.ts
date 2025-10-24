export const createSalesforceLead = async (tenantId: string, payload: Record<string, unknown>) => ({
  id: `${tenantId}-salesforce-${Date.now()}`,
  ...payload,
});
