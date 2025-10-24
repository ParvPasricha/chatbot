export const fetchFromSquare = async (tenantId: string, sku: string) => ({
  name: `Square item ${sku}`,
  price: 6.99,
  tenantId,
});
