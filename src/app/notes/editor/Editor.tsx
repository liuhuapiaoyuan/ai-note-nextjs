'use client'

import { createNote } from '@/actions/note.actions'
import { AIEditor } from "@/components/AIEditor"
import { Button, Input } from "@nextui-org/react"
import { Note } from '@prisma/client'
import { AiEditor } from 'aieditor'
import { useCallback, useState } from 'react'
import { useFormStatus } from 'react-dom'


function Editor(props: {
  note?: Note
}) {
  const { note } = props
  const { pending } = useFormStatus()
  const [content, setContent] = useState(note?.content ?? "")
  const onChange = useCallback((_: string, aiEditor: AiEditor) => {
    setContent(aiEditor.getMarkdown())
  }, [])



  return <>
    {/* 输入框 */}
    <form action={createNote} className="h-full flex flex-col gap-3">
      <input name="id" className='hidden' value={note?.id} readOnly defaultValue={note?.id} />
      <input name="type" className='hidden' readOnly defaultValue={note?.type} />
      <div>
        <Input
          defaultValue={note?.title}
          name="title" autoFocus variant="underlined" placeholder="文章标题" />
      </div>
      <div className="flex-1 h-1 w-full">
        <AIEditor
          value={note?.content ?? ""}
          onChange={onChange}
          placeholder="这还一个AI编辑器,您可以通过 / 来让AI帮你完善文章"
          className="h-full" />
      </div>
      <textarea hidden readOnly className='h-[100px]'
        value={content} name="content" />
      <div className="p-2">
        <Button type="submit" disabled={pending} isLoading={pending}>
          {note?.id ? "修改笔记" : "发表笔记"}
        </Button>
      </div>
    </form>
  </>
}


export { Editor }

