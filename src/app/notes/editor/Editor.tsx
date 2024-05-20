'use client'

import { createNote } from '@/actions/createNote'
import { AIEditor } from "@/components/AIEditor"
import { Button, Input } from "@nextui-org/react"
import { AiEditor } from 'aieditor'
import { useCallback, useState } from 'react'
import { useFormStatus } from 'react-dom'


function Editor() {
  const { pending } = useFormStatus()
  const [content, setContent] = useState("")
  const onChange = useCallback((_: string, aiEditor: AiEditor) => {
    setContent(aiEditor.getMarkdown())
  }, [])
  return <>
    {/* 输入框 */}
    <form action={createNote} className="h-full flex flex-col gap-3">

      <div>
        <Input name="title" autoFocus variant="underlined" placeholder="文章标题" />
      </div>
      <div className="flex-1 w-full">
        <AIEditor
          value={content}
          onChange={onChange}
          placeholder="这还一个AI编辑器,您可以通过 / 来让AI帮你完善文章"
          className="h-full" />
      </div>
      <textarea readOnly className='h-[100px]' value={content} name="content" />
      <div className="p-2">
        <Button type="submit" disabled={pending} isLoading={pending}>发表笔记</Button>
      </div>
    </form>
  </>
}


export { Editor }

