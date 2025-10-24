import assert from 'assert';
import { classifyIntent } from '../../orchestrator/src/engine/intentClassifier';

const result = classifyIntent('Can I book a table for tonight?');
assert.strictEqual(result.intent, 'booking');
console.log('orchestrator intent test passed');
