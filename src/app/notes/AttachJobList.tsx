'use client'
import { pendingAttachParseJob, remove } from "@/actions/attachParseJob.action";
import { Button } from "@/components/ui/button";
import { Listbox, ListboxItem } from "@nextui-org/react";

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useRequest } from "ahooks";

// 未完成热
export function AttachJobList() {
  const penddingList = useRequest(pendingAttachParseJob, {
    manual: false,
    pollingInterval: 5000
  })
  const removeJob = useRequest(remove, {
    manual: true,
    onFinally() {
      penddingList.run()
    }
  })
  const list = penddingList.data?.data;
  const count = list?.length ?? 0;
  return (count > 0) && <>
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button  >{(count) + "个文档解析中"}</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Listbox items={list?.map(z => ({
          key: z.id,
          label: z.fileName || "未命名文档"
        }))}
          aria-label="attachParseJobPendingList"
        >
          {(item) => (
            <ListboxItem
              onClick={() => {
                confirm("确定要删除吗？") && removeJob.run(item.key)
              }}
              key={item.key}
            >
              {item.label}
            </ListboxItem>
          )}

        </Listbox>
      </PopoverContent>
    </Popover>

  </>

}
