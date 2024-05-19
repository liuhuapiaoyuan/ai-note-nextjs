import { fetchEventSource } from '@microsoft/fetch-event-source'

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
    await fetchEventSource(this.url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',

      body: JSON.stringify(body),
      signal: this.controller.signal,
      onmessage: async ({ data }) => {
        if (data && data !== '[DONE]') {
          const result = JSON.parse(data) as {
            choices: { finish_reason: string; delta: { content: string } }[]
          }
          const isStop = result.choices?.some(z => z.finish_reason === 'stop')
          this.listener.onMessage({
            role: 'ai',
            content: result.choices?.map(z => z.delta?.content).join(''),
            index: 0,
            status: 0,
          })
          if (isStop) {
            this.onStop?.()
            this.listener.onStop()
          }
        }
      },
      onerror: error => {
        this.onStop?.()
        this.onError?.(error)
        this.listener.onStop()
      },
    })
  }
}
