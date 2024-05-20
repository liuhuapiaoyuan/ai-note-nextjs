"use client";

import logo from "@/assets/logo.png";
import AIChatButton from "@/components/AIChatButton";
import AddEditNoteDialog from "@/components/AddEditNoteDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from "@nextui-org/react";

import { BookMinus, LogOut, MailPlus, Plus } from "lucide-react";
import { User as AuthUser } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function NavBar({ user }: { user?: AuthUser }) {

  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);

  return (
    <>
      <div className="p-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/notes" className="flex items-center gap-1">
            <Image src={logo} alt="FlowBrain logo" width={40} height={40} />
            <span className="font-bold">FlowBrain</span>
          </Link>
          <div className="flex items-center gap-2">
            {
              user && <>
                <Dropdown
                  trigger="press"
                  showArrow
                  classNames={{
                    base: "before:bg-default-200", // change arrow background
                    content: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
                  }} >
                  <DropdownTrigger className="hover:bg-default-200 cursor-pointer py-1 px-3">
                    <User
                      name={user.name}
                      avatarProps={{ src: user.image!, size: "sm" }}
                    />
                  </DropdownTrigger>
                  <DropdownMenu
                    onAction={(key) => {
                      key === 'signOut' && signOut({
                        redirect: true,
                        callbackUrl: "/"
                      })
                      if (key === 'addMemo') {
                        setShowAddEditNoteDialog(true)
                      }
                    }}
                    aria-label="Static Actions">
                    <DropdownItem
                      key="new">
                      <User
                        name={user.name}
                        avatarProps={{ src: user.image!, size: "sm" }}
                      />
                    </DropdownItem>
                    <DropdownItem as={Link} href="/notes"
                      startContent={<BookMinus size={20} />}
                    >
                      我的笔记
                    </DropdownItem>
                    <DropdownItem
                      startContent={<Plus size={20} />}
                      key="addMemo">
                      新增备忘
                    </DropdownItem>
                    <DropdownItem as={Link} href="/notes/editor"
                      startContent={<MailPlus size={20} />}
                      key="addNote"  >
                      发布笔记
                    </DropdownItem>
                    <DropdownItem
                      startContent={<LogOut size={20} />}
                      key="signOut" className="text-danger" color="danger">
                      退出登录
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </>
            }
            <Button onClick={() => setShowAddEditNoteDialog(true)}>
              <Plus size={20} className="mr-2" />
              快速记录
            </Button>
            <AIChatButton user={user} />
            <ThemeToggleButton />
          </div>
        </div>
      </div>

      <AddEditNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
      />
    </>
  );
}
