import dynamic from 'next/dynamic'
/**
 * 导出可用的编辑器
 */
export const AIEditor = dynamic(() => import('./Editor'), { ssr: false })

export type { RichEditorProps } from './Editor'

