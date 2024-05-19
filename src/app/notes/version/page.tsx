import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { Home, Table } from "lucide-react";



export default function VersionPage() {
  return <div>
    <Breadcrumbs >
      <BreadcrumbItem startContent={<Home />} href="/notes">笔记</BreadcrumbItem>
      <BreadcrumbItem startContent={<Table />}>版本日志</BreadcrumbItem>
    </Breadcrumbs>

    <div>

    </div>
  </div>
}
