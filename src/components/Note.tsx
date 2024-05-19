"use client";

import { Note as NoteModel } from "@prisma/client";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

// 配置使用中文语言包
dayjs.locale('zh-cn')

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Button, Chip, Tooltip } from "@nextui-org/react";
import { Edit, RemoveFormatting } from "lucide-react";
import { useState } from "react";
import AddEditNoteDialog from "./AddEditNoteDialog";


interface NoteProps {
  note: NoteModel;
}

export default function Note({ note }: NoteProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const wasUpdated = note.updatedAt > note.createdAt;

  const createdUpdatedAtTimestamp = dayjs().to(dayjs(wasUpdated ? note.updatedAt : note.createdAt))

  return (
    <>
      <Card isHoverable>
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">{note.title}</h4>
              <h5 className="text-small tracking-tight text-default-400"> {createdUpdatedAtTimestamp}
                {wasUpdated && " (修改)"}</h5>
            </div>
          </div>
          <Chip isDisabled color="primary">成功</Chip>
        </CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-400">
          <p>
            {note.description}
          </p>
          <div className="flex flex-wrap gap-1">
            <span>#adsas#</span>
            <span>#adsas#</span>
            <span>#adsas#</span>
            <span>#adsas#</span>
          </div>
        </CardBody>
        <CardFooter className="gap-3">
          <Tooltip content="编辑" placement="bottom">
            <Button isIconOnly size="sm" color="secondary" startContent={<Edit />} onClick={() => setShowEditDialog(true)}></Button>
          </Tooltip>
          <Tooltip content="删除" placement="bottom">
            <Button isIconOnly size="sm" color="danger" startContent={<RemoveFormatting />}></Button>
          </Tooltip>
        </CardFooter>
      </Card>

      <AddEditNoteDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        noteToEdit={note}
      />
    </>
  );
}
