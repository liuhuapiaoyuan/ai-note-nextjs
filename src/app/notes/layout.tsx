import { auth } from "@/auth";
import { noteService } from "@/service/NoteService";
import { Sidebar } from "./Sidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  const statstics = await noteService.statistics(session?.user?.id!)

  return (
    <div className="flex h-full gap-1">
      <Sidebar user={session?.user} />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
