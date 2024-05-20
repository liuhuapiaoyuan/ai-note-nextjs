import { Metadata } from "next";
import { AutoLogin } from "./AutoLogin";
export const metadata: Metadata = {
  title: "FlowBrain - 登录系统",
};

export default async function SignInPage() {


  return (
    <div className="flex h-screen items-center justify-center">
      <AutoLogin />
      {/* <form
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
      </form> */}
    </div>
  );
}
