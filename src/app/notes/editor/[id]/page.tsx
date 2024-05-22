import { auth } from "@/auth";
import prisma from "@/lib/db/prisma";
import Link from "next/link";
import { Editor } from "../Editor";

export const metadata = {
  title: "FlowBrain-AI编辑笔记",
  description: "AI 发布笔记"
}


async function NoteEditorEditPage({ params: { id } }: any) {
  const session = await auth()
  const userId = session?.user?.id ?? "-1"
  const note = await prisma.note.findUnique({
    where: {
      id,
      userId
    }
  })


  return <>
    {
      note?.id ? (<Editor
        note={note}
      />) : <div className="h-full  w-full  flex items-center">
        <div className="text-center">
          <Link href="/notes">
            没有相关文档</Link>
        </div>
      </div>
    }


  </>
}

export default NoteEditorEditPage
