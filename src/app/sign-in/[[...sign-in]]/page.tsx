import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FlowBrain - 登录系统",
};

export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <form
        action={async () => {
          "use server"
          await signIn("casdoor", {
            redirectTo: "/"
          })
        }}
      >
        <Button type="submit">
          登录
        </Button>
      </form>
    </div>
  );
}
