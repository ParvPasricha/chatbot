import assert from 'assert';
import { chunkText } from '../../ingestion/src/utils/textChunker';

const chunks = chunkText('hello world'.repeat(20), 20, 5);
assert.ok(chunks.length > 1);
console.log('ingestion chunk test passed');
