'use client'
import { Tab, Tabs } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";

export function TypeTabs() {
  const params = useSearchParams()
  const type = params.get("type") ?? "0"
  return <Tabs variant="underlined"

    classNames={{
      tabList: "gap-6 w-full relative rounded-none p-0 border-none border-divider",
      cursor: "w-full bg-[#22d3ee]",
      tab: "max-w-fit px-0 h-12",
      tabContent: "group-data-[selected=true]:text-[#06b6d4]"
    }}
    aria-label="Options" selectedKey={type}>
    <Tab key="0" href="/notes?type=0" title="备忘" />
    <Tab key="1" href="/notes?type=1" title="笔记" />
    <Tab key="3" href="/notes?type=3" title="文档" />
  </Tabs>
}
