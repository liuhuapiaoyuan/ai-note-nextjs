import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { getEmbeedingModel } from "../openai";

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw Error("PINECONE_API_KEY is not set");
}

const pinecone = new Pinecone({
  apiKey,
});



export const notesIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME || "notes");
/**
 * 日志存储库
 */
export const notesStore = new PineconeStore(getEmbeedingModel(), { pineconeIndex: notesIndex });


