//Its purpose is to fetch relevant documents/questions from Pinecone based on a user query
// fetch the company specific data

import { index } from "../config/pinecone.js";
import getLocalEmbedding from "./testEmbedding.js";

async function retrieveFromPinecone(query, topK = 20) {
  const queryEmbedding = await getLocalEmbedding(query);

  const results = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
    filter: { type:{$ne : "core_question"}}
  });

  return results.matches.map(m => m.metadata);
}

async function retrieveCore(query, topK = 40) {
  const queryEmbedding = await getLocalEmbedding(query);

  const results = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
    filter: { type: "core_question"}
  });

  return results.matches.map(m => m.metadata);
}

async function retrieveSimilar(query){
  const queryEmbedding = await getLocalEmbedding(query);
  const res = await index.query({
    vector: queryEmbedding,
    includeMetadata: true,
    topK: 15
  })
  return res.matches.map(r => r.metadata);
}

export {retrieveFromPinecone, retrieveCore, retrieveSimilar};