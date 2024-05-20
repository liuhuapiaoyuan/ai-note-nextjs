import { Task, taskExecutor } from "@/lib/job/AsyncTaskExecutor";




export function GET() {
  taskExecutor.addTask(new Task(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Hello World")
        resolve()
      }, 1000)
    })
  }))
  return Response.json({
    data: taskExecutor.getCount()
  })
}
