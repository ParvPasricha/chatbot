export const fetchFromShopify = async (tenantId: string, sku: string) => ({
  name: `Shopify item ${sku}`,
  price: 4.99,
  tenantId,
});
