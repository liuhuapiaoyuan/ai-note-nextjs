import prisma from "@/lib/db/prisma";
import { Task, taskExecutor } from "@/lib/job/AsyncTaskExecutor";
import LLamaParser, { JobStatus } from "@/lib/parser/LLamaParser";
import { noteService } from "./NoteService";

const llamaParser = new LLamaParser()

class AttachParseJob {

  async useage() {
    return llamaParser.usage()
  }

  /**
   * 创建一个任务
   * @param file 
   */
  async createJob(userId: string, file: File) {
    // TODO 创建数据库表
    const fileName = Buffer.from(file.name, 'latin1').toString('utf8');
    console.log("file.name", file.name, fileName)
    const jobId = await llamaParser.createJob(file)

    const attachJob = await prisma.attachParseJob.create({
      data: {
        jobId,
        status: 0,
        mediaType: file.type,
        userId,
        fileName
      }
    })
    // 启动任务
    let status: JobStatus;
    const task = new Task(async () => {
      do {
        status = await llamaParser.checkJobStatus(jobId).then(r => r.status);
        if (status === 'SUCCESS') {
          const markdown = await llamaParser.getResult(jobId)
          await prisma.$transaction(async tx => {
            await prisma.attachParseJob.update({
              data: { status: 1, format: "markdown", result: markdown },
              where: { id: attachJob.id }
            })
            await noteService.crateNote({
              userId,
              type: 3,
              attachParseJobId: attachJob.id,
              title: fileName,
              content: markdown,
            })
          })
          break;
        } else if (status === JobStatus.ERROR) {
          console.log("任务执行失败了")
          await prisma.attachParseJob.update({
            data: { status: 3 },
            where: { id: attachJob.id }
          })
        } else if (status === JobStatus.CANCELED) {
          await prisma.attachParseJob.update({
            data: { status: 2 },
            where: { id: attachJob.id }
          })
        } else {
          // 添加适当的延迟，避免频繁请求
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } while (status === JobStatus.PENDING);
    })
    taskExecutor.addTask(task);
  }


  async cancelJob(userId: string, id: string) {
    const job = await prisma.attachParseJob.findUnique({
      where: {
        userId,
        id
      }
    })
    if (!job) {
      return { status: 404, error: "没有找到任务" }
    }
    if (job.status !== 0) {
      return { status: 406, error: "运行中的任务不能取消" }
    }
    // 删除任务
    await prisma.attachParseJob.delete({
      where: {
        id
      }
    })
    return {
      status: 200,
    }
  }
}

export const attachParseJobService = new AttachParseJob();
