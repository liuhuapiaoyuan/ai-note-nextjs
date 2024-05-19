'use client'
import { twMerge } from 'tailwind-merge'

import type { Editor } from '@tiptap/core'
import { useMount } from 'ahooks'
import { AiEditor, AiEditorOptions } from 'aieditor'
import 'aieditor/dist/style.css'
import { useEffect, useRef, useState } from 'react'
import { OpenaiAiModel } from './OpenaiAiModel'

export type RichEditorProps = {
  className?: string
  style?: React.CSSProperties
  value?: string
  onChange?: (value: string) => void
} & Omit<AiEditorOptions, 'element' | 'ai'>

const preventKeyboard = function (this: HTMLDivElement, event: Event): void {
  // 阻止按键默认行为
  event.preventDefault()
}
function modelFactoryCreate(name: string, editor: Editor, globalConfig: any) {
  // 改变编辑状态，防止光标
  const originalSetEditable = editor.setEditable.bind(editor)

  editor.setEditable = (editable: boolean) => {
    const dom = editor.view.dom as HTMLDivElement
    if (editable) {
      dom.removeEventListener('keydown', preventKeyboard)
      dom.removeEventListener('mousedown', preventKeyboard)
      dom.classList.remove('unselectable')
    } else {
      dom.addEventListener('keydown', preventKeyboard)
      dom.addEventListener('mousedown', preventKeyboard)
      dom.classList.add('unselectable')
    }
    return originalSetEditable(editable)
  }

  return new OpenaiAiModel(editor, globalConfig, name)
}
const AIActions: any[] = [
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"></path><path d="M4 18.9997H20V13.9997H22V19.9997C22 20.552 21.5523 20.9997 21 20.9997H3C2.44772 20.9997 2 20.552 2 19.9997V13.9997H4V18.9997ZM16.1716 6.9997L12.2218 3.04996L13.636 1.63574L20 7.9997L13.636 14.3637L12.2218 12.9495L16.1716 8.9997H5V6.9997H16.1716Z"></path></svg>`,
    name: 'AI 续写',
    prompt: '请帮我继续扩展一些这段话的内容',
    text: 'focusBefore',
    model: 'openai',
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"></path><path d="M15 5.25C16.7949 5.25 18.25 3.79493 18.25 2H19.75C19.75 3.79493 21.2051 5.25 23 5.25V6.75C21.2051 6.75 19.75 8.20507 19.75 10H18.25C18.25 8.20507 16.7949 6.75 15 6.75V5.25ZM4 7C4 5.89543 4.89543 5 6 5H13V3H6C3.79086 3 2 4.79086 2 7V17C2 19.2091 3.79086 21 6 21H18C20.2091 21 22 19.2091 22 17V12H20V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7Z"></path></svg>`,
    name: 'AI 优化',
    prompt: '请帮我优化一下这段文字的内容，并返回结果',
    text: 'selected',
    model: 'openai',
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"></path><path d="M15 5.25C16.7949 5.25 18.25 3.79493 18.25 2H19.75C19.75 3.79493 21.2051 5.25 23 5.25V6.75C21.2051 6.75 19.75 8.20507 19.75 10H18.25C18.25 8.20507 16.7949 6.75 15 6.75V5.25ZM4 7C4 5.89543 4.89543 5 6 5H13V3H6C3.79086 3 2 4.79086 2 7V17C2 19.2091 3.79086 21 6 21H18C20.2091 21 22 19.2091 22 17V12H20V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7Z"></path></svg>`,
    name: 'AI 翻译',
    prompt: '帮我将这段文字翻译成英文',
    text: 'selected',
    model: 'openai',
  },
]

/**
 *  Editor 组件
 * @param props
 * @returns
 */
function RichEditor(props: React.PropsWithRef<RichEditorProps>) {
  const { className, style, onChange, value } = props
  //定义 ref
  const divRef = useRef<HTMLDivElement>(null)
  const aiRef = useRef<AiEditor>()
  const [charCount, setCharCount] = useState(0)
  //初始化 AiEditor

  useMount(() => {
    if (divRef.current) {
      if (aiRef.current) {
        aiRef.current.setContent(value || '')
        return () => { }
      }
      const aiEditor = new AiEditor({
        element: divRef.current,
        placeholder: '点击输入内容/通过AI生成内容...',
        onChange(editor) {
          const text = editor.getText()
          const length = text.length
          setCharCount(length)
          onChange?.(text)
        },
        ai: {
          bubblePanelModel: 'openai',
          bubblePanelEnable: true,
          models: {
            'openai': {},
          },
          modelFactory: {
            create: modelFactoryCreate,
          },
          menus: AIActions,
          commands: AIActions,
        },
      })
      aiRef.current = aiEditor

      return () => {
        aiEditor.destroy()
      }
    }
  })

  // 监听value

  useEffect(() => {
    if (aiRef.current) {
      try {
        aiRef.current.setContent(value || '')
        // 滚动条
        aiRef.current.focusEnd()
      } catch (error) {
      }
    }
  }, [value])

  return (
    <div
      onClick={() => {
        aiRef.current?.focus()
      }}
      ref={divRef}
      className={twMerge('h-[600px]', className)}
      style={style}
    >
      <div className='aie-container !bg-transparent !border-none flex flex-col overflow-hidden'>
        <div className='aie-container-header' />
        <div className='aie-container-main flex-1 bg-white h-1 overflow-y-auto' />
        <div className='bg-gray-100 flex justify-end items-center border-0 border-t-1 p-2 '>
          <span className='text-xs'>字数：{charCount}</span>
        </div>
        <div className='aie-container-footer hidden' />
      </div>
    </div>
  )
}

export { RichEditor as Editor }

export default RichEditor
