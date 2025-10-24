export const createHubspotLead = async (tenantId: string, payload: Record<string, unknown>) => ({
  id: `${tenantId}-hubspot-${Date.now()}`,
  ...payload,
});
