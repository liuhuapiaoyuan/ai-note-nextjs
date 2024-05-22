import { cn } from "@/lib/utils";
import { Tooltip } from "@nextui-org/react";
import { XCircle } from "lucide-react";
import AIChat from "./AIChat";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
  user: {
    imageUrl: string
    nickname: string
  }
}

export default function AIChatBox({ open, onClose, user }: AIChatBoxProps) {
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

      <AIChat
        user={user}
        className="h-[600px]"
      />
    </div>
  );
}
