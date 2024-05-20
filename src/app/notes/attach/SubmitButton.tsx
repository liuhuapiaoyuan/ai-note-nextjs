'use client'
import { Button } from "@nextui-org/react";
import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const formStatus = useFormStatus()
  return <>
    <Button
      isLoading={formStatus.pending}

      type="submit">{
        formStatus.pending ? "文章上传中" : "上传附件"
      }</Button>
  </>;
}
