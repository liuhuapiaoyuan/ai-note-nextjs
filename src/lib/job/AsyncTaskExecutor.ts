import { nanoid } from "ai";

export class Task {
  id: string;
  status: 'pending' | 'running' = 'pending';
  action: () => Promise<void>;
  constructor(
    action: () => Promise<void>,
    id?: string) {
    this.id = id ?? nanoid(10);
    this.action = action
  }

  async execute(): Promise<void> {
    this.status = 'running';
    await this.action()
    this.status = 'pending';
  }
}


export class AsyncTaskExecutor {
  private queue: Task[] = [];
  private concurrency: number;
  private isProcessing: boolean = false;


  constructor(concurrency: number = 1) {
    this.concurrency = concurrency;
  }




  // 添加任务到队列
  addTask(task: Task): void {
    this.queue.push(task);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }


  // count
  getCount() {
    return this.queue.length
  }
  /**
   *  获取正在运行的任务数量
   * @returns 
   */
  getRunningCount() {
    return this.queue.filter(task => task.status === 'running').length
  }

  // 处理队列中的任务
  private async processQueue(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    while (this.queue.length > 0) {
      const tasksToProcess = this.queue.splice(0, this.concurrency);
      await Promise.all(tasksToProcess.map(task => this.executeTask(task)));
    }
    this.isProcessing = false;
  }

  // 执行单个任务
  private async executeTask(task: Task): Promise<void> {
    try {
      await task.action();
    } catch (error) {
      console.error('Error in task:', error);
    }
  }
}



const taskExecutorSingleton = () => {
  return new AsyncTaskExecutor();
};

const globalForPrisma = globalThis as unknown as {
  taskExecutor: AsyncTaskExecutor | undefined;
};

const taskExecutor = globalForPrisma.taskExecutor ?? taskExecutorSingleton();

export { taskExecutor };

if (process.env.NODE_ENV !== "production") globalForPrisma.taskExecutor = taskExecutor;
