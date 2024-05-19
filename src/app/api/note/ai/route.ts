export async function POST(req: Request) {
  const body = await req.json()
  const response = await fetch(
    process.env.OPENAI_BASE_URL! + '/chat/completions',
    {
      body: JSON.stringify({
        ...body,
        stream: true,
        model: process.env.OPENAI_MODEL_ID || 'gpt-3.5-turbo-16k',
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  )
  return new Response(response.body, { headers: response.headers })
}
