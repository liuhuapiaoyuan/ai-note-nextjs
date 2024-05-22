'use client'
import { getLLamaParseUsage } from "@/actions/note.actions";
import { Progress } from "@nextui-org/progress";
import { useRequest } from "ahooks";



// 定时轮训获得
export function ParserUsage() {
  const useage = useRequest(getLLamaParseUsage, {
    manual: false,
    pollingInterval: 500,

  })
  const maxPages = useage.data?.max_pdf_pages
  const firstLoading = (!useage.data) && useage.loading
  return <div className="text-sm">
    <div>文档解析用量</div>
    <div>
      <Progress
        size="sm"
        isIndeterminate={firstLoading}
        radius="sm"
        classNames={{
          base: "w-full",
          track: "drop-shadow-md border border-default",
          indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
          label: "tracking-wider font-medium text-default-600",
          value: "text-foreground/60",
        }}
        label={`${maxPages ?? '-'}页/每日`}
        value={useage.data?.usage_pdf_pages}
        showValueLabel={true}
      />
    </div>
  </div>
}
