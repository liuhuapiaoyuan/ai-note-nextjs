import { Editor } from "./Editor";

export const metadata = {
  title: "FlowBrain-AI发布笔记",
  description: "AI 发布笔记"
}


function NoteEditorPage() {
  return <div className="h-full w-full flex flex-col gap-3 ">
    <Editor />
  </div>
}

export default NoteEditorPage
