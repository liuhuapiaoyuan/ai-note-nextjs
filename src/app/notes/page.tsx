import { auth } from "@/auth";
import Note from "@/components/Note";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db/prisma";
import { Upload } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AttachJobList } from "./AttachJobList";
import { TypeTabs } from "./TypeTabs";

export const metadata: Metadata = {
  title: "FlowBrain - Notes",
};

export default async function NotesPage({ searchParams: { type } }: any) {

  const session = await auth();
  if (!session || !session.user) {
    return redirect("/sign-in")
  }
  const userId = session.user?.id
  const allNotes = await prisma.note.findMany({ where: { userId, type: Number(type ?? 0) } });

  return (
    <>
      <div className="p-3 flex gap-5 items-center">
        <div className="flex-1"><TypeTabs /></div>
        <div className="flex gap-2">
          {/* 如果是文档还需要处理 */}
          {
            type == "3" && <AttachJobList />
          }
          <Button asChild  >
            <Link href="/notes/attach">
              <Upload />
              上传附件
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allNotes.map((note) => (
          <Note note={note} key={note.id} />
        ))}
        {allNotes.length === 0 && (
          <div className="col-span-full text-center">
            你还没有任何笔记。为什么不创建一个呢？
          </div>
        )}
      </div>
    </>
  );
}

