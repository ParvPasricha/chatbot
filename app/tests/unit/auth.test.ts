import assert from 'assert';
import { hashPassword, verifyPassword } from '../../auth/src/utils/passwordHash';

(async () => {
  const hash = await hashPassword('secret');
  const valid = await verifyPassword('secret', hash);
  assert.ok(valid);
  console.log('auth password test passed');
})();
