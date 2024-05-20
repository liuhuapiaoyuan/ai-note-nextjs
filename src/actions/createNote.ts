'use server'

import { auth } from "@/auth";
import prisma from "@/lib/db/prisma";
import { NoteService } from "@/service/NoteService";

export async function createNote(formData: FormData) {
  const title = formData.get('title')?.toString()
  const content = formData.get('content')?.toString()
  console.log("接收到的参数", {
    title, content

  })
  const session = await auth();
  const userId = session?.user?.id!;
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const note = await prisma.$transaction(async (tx) => {
    const note = await tx.note.create({
      data: {
        title: title!,
        content,
        userId,
      },
    });
    return note;
  });
  // 总结
  NoteService.generateTagAndDescription(note)
  NoteService.createIndex(note)

}
