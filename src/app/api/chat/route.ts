import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import {
  ConsistencyLevelEnum,
  MilvusClient
} from "@zilliz/milvus2-sdk-node";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
export async function GET(req: Request) {
  const client = new MilvusClient({
    address: process.env.ZILLIZ_CLOUD_ADDRESS!,
    username: "db_f1cf3c92f1a307e",
    password: "Qg9,Gs{V4K-/5$4Q"
  });
  return Response.json({
    version: await client.getVersion(),
    message: "Hello, world!", data: ConsistencyLevelEnum
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    const messagesTruncated = messages.slice(-6);
    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );

    const { userId } = auth();

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    console.log("Relevant notes found: ", relevantNotes);

    const systemMessage: ChatCompletionMessage = {
      role: "system",
      content:
        "You must use language that is appropriate for the user. " +
        "You are an intelligent note-taking app. You answer the user's question based on their existing notes. " +
        "The relevant notes for this query are:\n" +
        relevantNotes
          .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
          .join("\n\n"),
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    // return new Response(response.toReadableStream(), {
    //   status: 200,
    //   headers: {
    //     contentType: "text/event-stream",
    //   }
    // });
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
