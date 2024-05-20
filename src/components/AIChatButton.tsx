import { Bot } from "lucide-react";
import { User } from "next-auth";
import { useState } from "react";
import AIChatBox from "./AIChatBox";
import { Button } from "./ui/button";

export default function AIChatButton(props: { user?: User }) {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  const { user } = props
  return (
    <>
      <Button onClick={() => setChatBoxOpen(true)}>
        <Bot size={20} className="mr-2" />
        笔记对话
      </Button>
      {
        user && <AIChatBox open={chatBoxOpen}
          user={{
            nickname: user.name!,
            imageUrl: user.image!
          }}
          onClose={() => setChatBoxOpen(false)} />
      }
    </>
  );
}
