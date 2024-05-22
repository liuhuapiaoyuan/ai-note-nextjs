import { auth } from "@/auth";
import { getLLM } from "@/lib/openai";
import { noteService } from "@/service/NoteService";
import {
  ChatPromptTemplate
} from "@langchain/core/prompts";
import { StreamingTextResponse } from "ai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatCompletionMessage } from "openai/resources/index.mjs";


const SYSTEM_TEMPLATE = `
YourName: '笔记助理'
YourJob:
1. Answer the user's questions based on the below context. 
2. If the context doesn't contain any relevant information to the question.
3. If the user asks a question that is not in the context and not in Current conversation , don't make something up and just say "I don't know".


<context>
{context}
</context>


Current conversation:
{chat_history}

Question: {question}
assistant: `;
const formatMessage = (message: ChatCompletionMessage) => {
  return `${message.role}: ${message.content}`
}




export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id!;
  const body = await req.json();
  const messages: ChatCompletionMessage[] = body.messages;
  const messagesTruncated = messages.slice(0, -1).slice(-6);
  const query = messages.slice(-1)[0].content!;
  try {
    const questionAnsweringPrompt = ChatPromptTemplate.fromTemplate(SYSTEM_TEMPLATE);
    const documents = await noteService.queryDocuemnts(query, userId, 3)
    const llm = getLLM()
    const documentChain = await createStuffDocumentsChain({
      llm,
      prompt: questionAnsweringPrompt
    });
    const stream = await documentChain.stream({
      context: documents,
      chat_history: messagesTruncated.map(formatMessage).join("\r\n"),
      question: query,
    })
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
