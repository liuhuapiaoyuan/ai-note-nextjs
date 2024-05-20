import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function isBlank(string?: string) {
  //  判断字符串是否为空
  if (string === null || string === undefined || string === '') {
    return true
  }
  return false
}
