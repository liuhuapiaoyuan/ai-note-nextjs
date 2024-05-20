
import { NextUIProvider as Provider } from '@nextui-org/react'

export function NextUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider >
      {children}
    </Provider>
  )
}
