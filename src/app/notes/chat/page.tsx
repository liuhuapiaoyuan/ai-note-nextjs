import { auth } from "@/auth";
import AIChat from "@/components/AIChat";
import { redirect } from "next/navigation";



export default async function ChatPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/")
  }
  const user = {
    imageUrl: session?.user?.image!,
    nickname: session?.user?.name!
  }
  return <>
    <AIChat
      user={user}
      className="w-full h-full bg-gray-50 rounded-3xl p-5"
    />
  </>
}
