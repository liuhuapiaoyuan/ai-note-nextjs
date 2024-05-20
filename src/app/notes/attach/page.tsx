import { auth } from "@/auth";
import { attachParseJobService } from "@/service/AttachParseJob";
import { redirect } from "next/navigation";
import { SubmitButton } from "./SubmitButton";



export default function AttachPage() {

  return <div className="flex h-full flex-col justify-center items-center">

    <form action={async (formData: FormData) => {
      'use server'
      const attach = formData.get("file")?.valueOf() as File
      const session = await auth()
      const userId = session?.user?.id!
      await attachParseJobService.createJob(userId, attach)
      redirect("/notes?type=3")
    }}>
      <label htmlFor="file" className="p-2 flex gap-1">
        <div>
          选择附件：
        </div>
        <div>
          <input
            name="file" type="file"
            accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.presentation"
          />
          <div className="text-sm text-red-500">
            支持附件： ppt/excel/word/pdf/txt等个是
          </div>
        </div>
      </label>
      <SubmitButton />

    </form>
  </div>
}

