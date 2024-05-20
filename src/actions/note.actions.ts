'use server'

import { auth } from "@/auth";
import prisma from "@/lib/db/prisma";
import { attachParseJobService } from "@/service/AttachParseJob";
import { noteService } from "@/service/NoteService";
import { redirect } from "next/navigation";
/**
 * 创建笔记
 * @param formData 
 * @returns 
 */
export async function createNote(formData: FormData) {
  const title = formData.get('title')?.toString()
  const content = formData.get('content')?.toString()
  const id = formData.get('id')?.toString() ?? "-1"
  const session = await auth();
  const userId = session?.user?.id!;
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  let note = await prisma.note.findUnique({ where: { userId, id } });
  const noteData = {
    title: title!,
    content,
    userId,

  };
  if (!note) {
    note = await prisma.note.create({
      data: { ...noteData, type: 1 }
    })
  } else {
    note = await prisma.note.update({
      data: noteData,
      where: { id }
    })
  }

  noteService.generateTagAndDescription(note)
  noteService.createIndex(note)

  // 成功就返回
  redirect("/notes?type=1")
}

async function delay(time: number) {

  return new Promise(resolve => setTimeout(resolve, time))
}

/**
 * 删除日记
 * @param noteId 
 * @returns 
 */
export async function remoteNote(noteId: string) {
  await delay(1000)
  try {
    const session = await auth();
    const userId = session?.user?.id!;
    if (!userId) {
      return { error: "Unauthorized", status: 401 }
    }
    const id = noteId

    const note = await prisma.note.findUnique({ where: { id, userId } });

    if (!note) {
      return { error: "Note not found", status: 404 }

    }
    await prisma.$transaction(async (tx) => {
      await noteService.cleanIndex(note);
      await tx.note.delete({ where: { id } });
    });
    return { message: "Note deleted", status: 200 }
  } catch (error) {
    return { error: "Internal server error", status: 500 }
  }

}


/**
 * 数据统计
 */
export async function statistics() {
  const session = await auth();
  const userId = session?.user?.id!;
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const embeddingStatusStatistics = await noteService.statistics(userId)
  return { embeddingStatusStatistics }
}


export const getLLamaParseUsage = async () => {
  return attachParseJobService.useage();
};


