import { ChatBaiduWenxin } from "@langchain/community/chat_models/baiduwenxin";
import { ZhipuAIEmbeddings } from "@langchain/community/embeddings/zhipuai";
import { ChatOpenAI } from "@langchain/openai";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw Error("OPENAI_API_KEY is not set");
}

const openai = new OpenAI({ apiKey, baseURL: process.env.OPENAI_BASE_URL });

export default openai;

export async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  const embedding = response.data[0].embedding;

  if (!embedding) throw Error("Error generating embedding.");


  return embedding;
}


/**
 * 获得当前的大语言模型
 * @returns 
 */
export function getLLM() {
  return new ChatOpenAI({
    model: "gpt-3.5-turbo-16k", // Available models:
  });
}
export function getBaiduWenxin() {
  return new ChatBaiduWenxin({
    model: "ERNIE-Speed-128K",
  });
}
/**
 * 获得向量化模型
 * @returns 
 */
export function getEmbeedingModel() {
  return new ZhipuAIEmbeddings({});
}
