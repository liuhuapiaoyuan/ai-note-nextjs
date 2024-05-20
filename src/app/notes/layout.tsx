import { auth } from "@/auth";
import { NoteService } from "@/service/NoteService";
import NavBar from "./NavBar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  const statstics = await NoteService.statistics(session?.user?.id!)

  return (
    <>
      <NavBar
        statistics={statstics}
        user={session?.user} />
      <main className="flex-1 w-full md:max-w-7xl md:m-auto p-4">{children}</main>
    </>
  );
}
