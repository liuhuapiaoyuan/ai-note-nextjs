import { auth } from "@/auth";
import NavBar from "./NavBar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <>
      <NavBar user={session?.user} />
      <main className="m-auto max-w-7xl p-4">{children}</main>

    </>
  );
}
