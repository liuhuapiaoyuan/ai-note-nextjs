'use client'

import { AIEditor } from "@/components/AIEditor"
import { Button, Input } from "@nextui-org/react"



function Editor() {
  return <>
    {/* 输入框 */}
    <div>
      <Input autoFocus variant="underlined" placeholder="文章标题" />
    </div>
    <div className="flex-1 w-full">
      <AIEditor
        placeholder="这还一个AI编辑器,您可以通过 / 来让AI帮你完善文章"
        className="h-full" />
    </div>
    <div className="p-2">
      <Button>发表笔记</Button>
    </div>
  </>
}


export { Editor }

