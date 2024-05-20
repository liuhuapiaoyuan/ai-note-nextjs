'use server'
import { auth } from "@/auth";
import prisma from "@/lib/db/prisma";
import { attachParseJobService } from "@/service/AttachParseJob";


/**
 * 获得运行中的任务
 * @returns 
 */
export async function pendingAttachParseJob() {
  const session = await auth();
  const userId = session?.user?.id
  if (!userId) {
    return { status: 403, error: "You must be logged in to attach a job!" }
  }
  const list = await prisma.attachParseJob.findMany({
    where: {
      userId,
      status: 0
    }
  })
  return {
    status: 200,
    data: list
  }
}
export async function remove(id: string) {
  const session = await auth();
  const userId = session?.user?.id
  if (!userId) {
    return { status: 403, error: "You must be logged in to attach a job!" }
  }
  return attachParseJobService.cancelJob(userId!, id)
}
