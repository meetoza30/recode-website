import { pipeline } from '@xenova/transformers';

let embedder;

export default async function getLocalEmbedding(text) {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  const output = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data); // Float32Array → JS Array
}


//This file’s job is to “translate” human-readable text 
// into vectors so your system can find semantically 
// similar questions efficiently.