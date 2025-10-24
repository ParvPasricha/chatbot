import express from 'express';
import { fetchFromShopify } from './shopify.client';
import { fetchFromSquare } from './square.client';
import { fetchFromToast } from './toast.client';
import { getEnv, createLogger } from '@chatbot/shared';

const app = express();
const env = getEnv();
const logger = createLogger('tools-product');
app.use(express.json());

app.post('/product', async (req, res) => {
  const { tenantId, id, source = 'shopify' } = req.body;
  let product;
  switch (source) {
    case 'shopify':
      product = await fetchFromShopify(tenantId, id);
      break;
    case 'square':
      product = await fetchFromSquare(tenantId, id);
      break;
    case 'toast':
      product = await fetchFromToast(tenantId, id);
      break;
    default:
      product = { name: 'Unknown product', price: 0 };
  }
  res.json({ product });
});

if (require.main === module) {
  const port = Number(new URL(env.TOOLS_SERVICE_URL).port || '4501');
  app.listen(port, () => logger.info(`Product adapter listening on ${port}`));
}

export default app;
