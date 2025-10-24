export const fetchFromToast = async (tenantId: string, sku: string) => ({
  name: `Toast item ${sku}`,
  price: 5.49,
  tenantId,
});
