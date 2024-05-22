import { Message as VercelChatMessage } from 'ai';

import { getLLM } from '@/lib/openai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`
}



/**
 * 预设模板
 */
const TEMPLATE = `
AI Response Language: {language} 
Current conversation:
{chat_history}

Question: {question}
AI:`

export async function POST(req: Request) {
  const body = await req.json()
  const messages = body.messages ?? []
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage)
  const query = messages[messages.length - 1].content
  const model = getLLM()
  model.temperature = Math.max(0.1, Number(body.temperature ?? 0.1))
  model.topP = Number(body.topP ?? 0.9)
  const prompt = ChatPromptTemplate.fromTemplate(TEMPLATE);
  const chain = prompt.pipe(model).pipe(new StringOutputParser())

  try {
    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join('\n'),
      question: query,
      language: "chinese",
    })
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream"
      }
    })

  } catch (error) {
    return Response.json({
      status: 500,
      msg: (error as Error)?.message || "Internal server error"
    })
  }

  //return new StreamingTextResponse(stream)
}
