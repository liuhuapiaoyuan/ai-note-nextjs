"use client";

import logo from "@/assets/logo.png";
import { User as AuthUser } from "next-auth";

import Image from "next/image";
import Link from "next/link";

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Listbox, ListboxItem, ListboxSection, User } from "@nextui-org/react";
import { BrainCog, Codepen, FolderOpen, LogOut, Users } from "lucide-react";
import { signOut } from "next-auth/react";
import { ParserUsage } from "./ParserUsage";
/**
 * 左侧菜单你
 * @returns 
 */
export function Sidebar(props: { user?: AuthUser }) {
  const { user } = props
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <div className="w-full max-w-[260px] p-5 gap-5 h-full flex flex-col">
      {/* LOGO */}
      <div>
        <Link href="/" className="flex items-center gap-1">
          <Image src={logo} alt="FlowBrain logo" width={40} height={40} />
          <span className="font-bold">FlowBrain</span>
        </Link>
      </div>


      <Listbox className="flex-1"
        selectionMode="single"
        itemClasses={{
          wrapper: "data-[selected=true]:transition-colors data-[selected=true]:bg-default/40 data-[selected=true]:text-default-foreground"
        }}
        //data-[selected=true]:transition-colors data-[selected=true]:bg-default/40 data-[selected=true]:text-default-foreground
        hideSelectedIcon
        selectedKeys={["/notes/profile"]}
        variant="flat" aria-label="Listbox menu with sections">
        <ListboxSection>
          <ListboxItem
            key="/notes/chat"
            href="/notes/chat"
            as={Link}
            description="和你的私人知识管家对话"
            startContent={<BrainCog className={iconClasses} />}
          >
            知识管家
          </ListboxItem>
        </ListboxSection>

        <ListboxSection title="操作">
          <ListboxItem
            key="/notes/tools"
            href="/notes/tools"
            as={Link}
            description="网页/PDF/写作"
            startContent={<Codepen className={iconClasses} />}
          >
            工具箱
          </ListboxItem>
          <ListboxItem
            key="/notes"
            as={Link}
            href="/notes"
            description="备忘、笔记、文档都收藏于此"
            startContent={<FolderOpen className={iconClasses} />}
          >
            我的记录
          </ListboxItem>
          <ListboxItem
            key="/notes/profile"
            as={Link}
            description={``}
            href="/notes/profile"
            startContent={<Users className={iconClasses} />}
          >
            个人中心
          </ListboxItem>
        </ListboxSection>

      </Listbox>
      {/* <Listbox className="flex-1"
        variant="flat" aria-label="Listbox menu with sections">
      </Listbox> */}
      <div className="p-2 border-small bg-gray-50 rounded-xl ">
        <ParserUsage />
      </div>
      <div>
        {
          user && <>
            <Dropdown
              trigger="press"
              placement="right"
              showArrow
              classNames={{
              }} >
              <DropdownTrigger className="hover:bg-default-200 cursor-pointer w-full p-2 justify-start">
                <User
                  name={user.name}
                  avatarProps={{ src: user.image!, }}
                />
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => {
                  key === 'signOut' && signOut({
                    redirect: true,
                    callbackUrl: "/"
                  })
                }} >
                <DropdownItem
                  startContent={<LogOut size={20} />}
                  key="signOut" className="text-danger" color="danger">
                  退出登录
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        }
      </div>
    </div>
  );
}
