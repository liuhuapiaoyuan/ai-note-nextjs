import { cn } from "@/lib/utils";
import { Textarea, Tooltip } from "@nextui-org/react";
import { Message } from "ai";
import { useChat } from "ai/react";
import { Bot, Trash, XCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
  user: {
    imageUrl: string
    nickname: string
  }
}

export default function AIChatBox({ open, onClose, user }: AIChatBoxProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,

    isLoading,
    error,
  } = useChat();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  // 监听ctrl+enter提交消息
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        const submitEvent = new Event('submit', {
          bubbles: true,
          cancelable: true,
        });

        // 触发表单的提交事件
        formRef.current?.dispatchEvent(submitEvent);
      }
    };


    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit, input]);

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      className={cn(
        "bottom-0 m-2 z-[999] right-0  w-full max-w-[500px] p-1 xl:right-36  rounded-lg overflow-hidden border bg-background shadow-xl",
        open ? "fixed" : "hidden",
      )}
    >
      <Tooltip content="关闭聊天窗口">
        <button onClick={onClose} className="mt-0 ms-auto block">
          <XCircle size={30} />
        </button>
      </Tooltip>

      <div className="flex h-[600px] flex-col ">
        <div className="mt-3 h-full overflow-y-auto px-3" ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage user={user} message={message} key={message.id} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage user={user}
              message={{
                role: "assistant",
                content: "思考中...",
              }}
            />
          )}
          {error && (
            <ChatMessage user={user}
              message={{
                role: "assistant",
                content: "出现了一些小问题，您可以尝试重新输入或联系我们。",
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className="flex h-full items-center justify-center gap-3">
              <Bot />
              请问您有什么想问的？
            </div>
          )}
        </div>
        <form ref={formRef} onSubmit={handleSubmit} className="m-3 ">


          <Textarea

            classNames={{
              innerWrapper: "flex items-end"
              //  inputWrapper: "data-[hover]:bg-transparent data-[focus]:bg-transparent bg-transparent shadow-none ",
            }}

            autoFocus
            value={input}
            onChange={handleInputChange}
            placeholder="和您的文档对话"
            ref={inputRef}
            endContent={
              <div className="flex items-center gap-2">
                <Tooltip content="清空对话记录">
                  <Button
                    title="Clear chat"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    type="button"
                    onClick={() => setMessages([])}
                  >
                    <Trash />
                  </Button>
                </Tooltip>
                <Button type="submit">发送</Button>
              </div>

            }
          />
        </form>
      </div>
    </div>
  );
}

function ChatMessage({
  message: { role, content },
  user
}: {
  message: Pick<Message, "role" | "content">;
  user: {
    imageUrl: string
  }
}) {



  const isAiMessage = role === "assistant";

  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAiMessage ? "me-5 justify-start" : "ms-5 justify-end",
      )}
    >
      {isAiMessage && <Bot className="mr-2 shrink-0" />}
      <p
        className={cn(
          "whitespace-pre-line rounded-md border px-3 py-2",
          isAiMessage ? "bg-background" : "bg-primary text-primary-foreground",
        )}
      >
        {content}
      </p>
      {!isAiMessage && user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt="User image"
          width={100}
          height={100}
          className="ml-2 h-10 w-10 rounded-full object-cover"
        />
      )}
    </div>
  );
}
