"use client";

import logo from "@/assets/logo.png";
import AIChatButton from "@/components/AIChatButton";
import AddEditNoteDialog from "@/components/AddEditNoteDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function NavBar({ user }: { user?: User }) {

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
                <img alt={user.name} src={user.image} className="w-10 h-10 rounded-full" />
                <span>{user.name}</span>
              </>
            }
            <ThemeToggleButton />
            {
              user && <Button onClick={() => signOut()} type="submit" className="bg-red-500 hover:bg-red-800" >
                <LogOut size={20} className="mr-2" />
                退出登录
              </Button>
            }
            <Button onClick={() => setShowAddEditNoteDialog(true)}>
              <Plus size={20} className="mr-2" />
              新增笔记
            </Button>
            <AIChatButton user={user} />
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
