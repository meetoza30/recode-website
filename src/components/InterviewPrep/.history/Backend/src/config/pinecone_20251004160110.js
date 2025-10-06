import { Pinecone } from '@pinecone-database/pinecone';
import "dotenv/config";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});
const index = pc.index('ty-project');

export {index, pc}
