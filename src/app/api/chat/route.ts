import { auth } from "@/auth";
import { getLLM } from "@/lib/openai";
import { NoteService } from "@/service/NoteService";
import {
  ChatPromptTemplate
} from "@langchain/core/prompts";
import { StreamingTextResponse } from "ai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatCompletionMessage } from "openai/resources/index.mjs";


const SYSTEM_TEMPLATE = `
YourName: '笔记助理'
Answer the user's questions based on the below context. 
If the context doesn't contain any relevant information to the question, don't make something up and just say "I don't know":
<context>
{context}
</context>
`;
export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id!;
  const body = await req.json();
  const messages: ChatCompletionMessage[] = body.messages;
  const messagesTruncated = messages.slice(-6);
  const query = messagesTruncated.slice(-1)[0].content!;
  try {
    const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
      ["system", SYSTEM_TEMPLATE],
      // @ts-ignore
      ...messagesTruncated.map(z => [z.role as 'user', z.content!]),
    ]);
    const documents = await NoteService.queryDocuemnts(query, userId, 3)
    const llm = getLLM()
    const documentChain = await createStuffDocumentsChain({
      llm,
      prompt: questionAnsweringPrompt,
    });

    const stream = await documentChain.stream({
      context: documents,
    })

    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
