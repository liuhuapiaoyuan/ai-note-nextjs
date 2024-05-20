"use client";

import { Note as NoteModel } from "@prisma/client";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

// 配置使用中文语言包
dayjs.locale('zh-cn')

import { remoteNote } from "@/actions/note.actions";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip } from "@nextui-org/react";
import { useBoolean } from "ahooks";
import { BatteryWarningIcon, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AddEditNoteDialog from "./AddEditNoteDialog";

const Status = {
  0: "",
  1: <Chip color="warning">训练中</Chip>,
  2: <Tooltip content="训练成功的文本将可以通过AI进行对话">
    <Chip color="success">训练成功</Chip>
  </Tooltip>,
  3: <Chip color="danger">错误</Chip>,
}
interface NoteProps {
  note: NoteModel;
}

export default function Note({ note }: NoteProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const wasUpdated = note.updatedAt > note.createdAt;
  const createdUpdatedAtTimestamp = dayjs().to(dayjs(wasUpdated ? note.updatedAt : note.createdAt))

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [loading, { set: setLoading }] = useBoolean()
  return (
    <>
      <Card >
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">{note.title}</h4>
              <h5 className="text-small tracking-tight text-default-400"> {createdUpdatedAtTimestamp}
                {wasUpdated && " (修改)"}</h5>
            </div>
          </div>
          {Status[note.embeedingStatus as 0]}
        </CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-400">
          <div className="line-clamp-3 max-h-32">
            {note.description}
          </div>
        </CardBody>
        <CardFooter className="gap-3">
          <Tooltip content="编辑" placement="bottom">
            {
              note.type == 0 ? <Button
                isIconOnly
                size="sm" color="secondary" startContent={<Edit />}
                onClick={() => setShowEditDialog(true)} /> : <Button
                isIconOnly as={Link}
                href={`/notes/editor/${note.id}`}
                size="sm" color="secondary" startContent={<Edit />}
              />

            }
          </Tooltip>
          <Tooltip content="删除" placement="bottom">
            <Button onClick={() => setConfirmDelete(true)}
              isIconOnly size="sm" color="danger" startContent={<Trash />}></Button>
          </Tooltip>
        </CardFooter>
      </Card>

      <AddEditNoteDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        noteToEdit={note}
      />

      {/* 删除确认 */}
      <Modal isOpen={confirmDelete} onOpenChange={setConfirmDelete}>
        <ModalContent>
          <ModalHeader>系统提示</ModalHeader>
          <ModalBody>
            <BatteryWarningIcon />
            您确认要删除该信息吗？(系统会同步删除索引)
          </ModalBody>
          <ModalFooter>
            <Button isLoading={loading}
              onClick={async () => {
                setLoading(true)
                const result = await remoteNote(note.id)
                if (result.status == 200) {
                  alert("删除成功！")
                  location.reload()
                } else {
                  alert(result.error)
                }
                setConfirmDelete(false)
                setLoading(false)
              }}
              color="danger"
            >确认操作</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
