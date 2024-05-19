'use client'
import type { Editor } from '@tiptap/core'
import { AiEditorOptions } from 'aieditor'
import { AiMessageListener, SSEClient } from './SSEClient'

type AiModelConfig = {
  model?: string
  authKey?: string
}

export class OpenaiAiModel {
  editor: Editor
  globalConfig: NonNullable<AiEditorOptions['ai']>
  aiModelName: string
  aiModelConfig: AiModelConfig

  constructor(editor: Editor, globalConfig: any, aiModelName: string) {
    this.editor = editor
    this.globalConfig = globalConfig
    this.aiModelName = aiModelName
    this.aiModelConfig = globalConfig?.models?.[aiModelName]
  }

  chat(
    selectedText: string,
    prompt: string,
    listener: AiMessageListener
  ): void {
    const onFinished = (url: string) => {
      const aiClient = this.createAiClient(url, listener)
      const promptMessage = this.wrapMessage(`${selectedText}\n${prompt}`)
      this.editor.setEditable(false)
      aiClient.start(promptMessage)
    }

    if (this.globalConfig.onCreateClientUrl) {
      this.globalConfig.onCreateClientUrl(
        this.aiModelName,
        this.aiModelConfig,
        onFinished
      )
    } else {
      onFinished(this.createAiClientUrl())
    }
  }

  /**
   * 创建客户端链接 URL
   */
  createAiClientUrl() {
    return '/api/editor/ai'
  }
  /**
   * 创建客户端
   */
  createAiClient(url: string, listener: AiMessageListener) {
    const sseClient = new SSEClient(url, listener)
    sseClient.setOnStop(() => {
      this.editor.setEditable(true)
    })
    return sseClient
  }
  /**
   * 封装消息，把 prompt 转换为协议需要的格式
   * @param promptMessage
   */
  wrapMessage(promptMessage: string) {
    return {
      max_tokens: 2048,
      temperature: 0,
      top_p: 0.9,
      messages: [
        {
          'role': 'system',
          'content': promptMessage,
        },
      ],
    }
  }
}
