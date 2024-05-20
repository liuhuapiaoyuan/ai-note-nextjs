'use client'
import { signIn } from "next-auth/react"
import { useEffect } from "react"


export function AutoLogin() {
  useEffect(() => {
    signIn("casdoor", { callbackUrl: "/" })
  }, [])
  return <>

  </>
}
