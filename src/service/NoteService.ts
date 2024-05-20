

import { notesStore } from '@/lib/db/pinecone';
import prisma from '@/lib/db/prisma';
import { Task, taskExecutor } from '@/lib/job/AsyncTaskExecutor';
import { getLLM } from '@/lib/openai';
import { isBlank } from '@/lib/utils';
import { Note } from '@prisma/client';
import { RefineDocumentsChain, loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DEFAULT_PROMPT } from './prompts';


export const noteService = {
  /**
   * 创建note并建立索引
   * @param note 
   */
  async crateNote(data: Pick<Note, "type" | "userId" | "attachParseJobId" | "title" | "content">) {
    const note = await prisma.note.create({
      data
    })
    // 生成描述文本
    taskExecutor.addTask(new Task(() => noteService.generateTagAndDescription(note)))
    // 创建索引
    taskExecutor.addTask(new Task(() => noteService.createIndex(note)))
  },


  // 开始训练某个文章
  async createIndex(note: Note) {
    if (!note) {
      throw new Error("Not Found Note")
    }
    const docs = await this.createDocuments(note)
    await prisma.note.update({
      where: { id: note.id },
      data: {
        embeedingStatus: 1,
      }
    })
    try {
      await notesStore.delete({
        ids: JSON.parse(note.chunkIds ?? "[]")
      });
      console.log("delete chunks", note.chunkIds)
      const chunkIds = await notesStore.addDocuments(docs);
      await prisma.note.update({
        where: { id: note.id },
        data: {
          embeedingStatus: 2,
          chunkIds: JSON.stringify(chunkIds)
        }
      })
    } catch (error) {
      await prisma.note.update({
        where: { id: note.id },
        data: {
          embeedingStatus: 3,
        }
      })
    }
  },
  /**
   * 清理索引
   */
  async cleanIndex(note: Note) {
    await notesStore.delete({
      ids: JSON.parse(note.chunkIds ?? "[]")
    });
  },

  /**
   * 文档检索
   * @param query 
   * @param userId 
   * @param topK 
   * @returns 
   */
  async queryDocuemnts(query: string, userId: string, topK: number = 1) {
    const results = await notesStore.similaritySearch(query, topK, {
      userId
    });
    return results
  },

  async createDocuments(note: Note) {
    if (!note) {
      throw new Error("Not Found Note")
    }
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    const text = `${isBlank(note.title) ? "" : `Title:${note.title}
    DocumentContent:`}
    ${note.content}
    `
    const output = await splitter.createDocuments([text]);
    output.forEach((doc) => {
      doc.metadata = {
        ...doc.metadata,
        noteId: note.id,
        userId: note.userId,
      };
    });
    return output
  },

  /**
   * 生成文章描述文本
   * @param noteId 
   */
  async generateTagAndDescription(note: Note) {
    if (!note) {
      throw new Error("Not Found Note")
    }
    const noteId = note.id
    const documents = await this.createDocuments(note)
    const summaryChian = loadSummarizationChain(getLLM(), {
      type: "map_reduce",
      combinePrompt: DEFAULT_PROMPT,
      combineMapPrompt: DEFAULT_PROMPT
    }) as RefineDocumentsChain;

    const description = await summaryChian.invoke({
      input_documents: documents,
    })
    await prisma.note.update({
      where: { id: noteId },
      data: {
        description: description?.text
      }
    })
  },
  async statistics(userId: string) {
    return prisma.note.groupBy({
      by: ['embeedingStatus'],
      _count: {
        id: true
      },
      where: {
        userId
      }
    }

    ).then(res => {
      return res.reduce((pre, cur) => {
        pre[cur.embeedingStatus] = cur._count.id
        return pre
      }, {} as Record<string, number>)
    })
  }


}
