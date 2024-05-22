
export interface AiMessage {
  role: string
  content: string
  index: number
  status: 0 | 1 | 2
}
export interface AiMessageListener {
  onStart: (aiClient: any) => void
  onStop: () => void
  onMessage: (message: AiMessage) => void
}

async function* streamToAsyncIterable(stream: ReadableStream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}



export class SSEClient {
  url: string
  controller: AbortController
  listener: AiMessageListener
  private onStop?: () => void
  onError?: (error: any) => void
  constructor(url: string, listener: AiMessageListener) {
    this.url = url
    this.listener = listener
    this.controller = new AbortController()
  }

  setOnStop(onStop: () => void) {
    this.onStop = onStop
  }

  stop() {
    this.controller.abort()
    this.listener.onStop()
  }

  /**
   * 发送消息
   * @param body
   */
  async start(body: any) {
    this.controller = new AbortController()
    this.listener.onStart?.(this)
    try {
      const resp = await fetch(this.url, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(body),
      })
      const decoder = new TextDecoder()
      if (resp.body) {
        const streamProcess = async () => {
          for await (const chunk of streamToAsyncIterable(resp.body!)) {
            const content = decoder.decode(chunk)
            this.listener.onMessage({
              role: 'ai',
              content,
              index: 0,
              status: 0,
            })
          }
          this.onStop?.()
          this.listener.onStop()
        }
        streamProcess()
      } else {
        this.onStop?.()
        this.onError?.("error reader")
        this.listener.onStop()
      }
    } catch (e) {
      this.onStop?.()
      this.onError?.(e)
      this.listener.onStop()
    }



    // await fetchEventSource(this.url, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'POST',

    //   body: JSON.stringify(body),
    //   signal: this.controller.signal,
    //   onmessage: async ({ data }) => {
    //     console.log(data)
    //     // if (data && data !== '[DONE]') {
    //     //   const result = JSON.parse(data) as {
    //     //     choices: { finish_reason: string; delta: { content: string } }[]
    //     //   }
    //     //   const isStop = result.choices?.some(z => z.finish_reason === 'stop')
    //     //   this.listener.onMessage({
    //     //     role: 'ai',
    //     //     content: result.choices?.map(z => z.delta?.content).join(''),
    //     //     index: 0,
    //     //     status: 0,
    //     //   })
    //     //   if (isStop) {
    //     //     this.onStop?.()
    //     //     this.listener.onStop()
    //     //   }
    //     // }
    //   },
    //   onerror: error => {
    //     this.onStop?.()
    //     this.onError?.(error)
    //     this.listener.onStop()
    //   },
    // })
  }
}
