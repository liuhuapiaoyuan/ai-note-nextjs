import IconApp from '@/assets/logo.png'
import { Chip } from '@nextui-org/react'
import { Book, BookMarked, FileText, Github, MessageCircleIcon, Pencil } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const Categories = [
  {
    "category": "写作提效",
    "tools": [
      {
        "title": "快速记录",
        "description": "快速记录灵感、想法、创意等",
        "icon": <Image
          width={60}
          height={60}
          src={IconApp} alt="快速记录" className="h-12 w-12" />
        ,
        link: "/notes"

      },
      {
        "title": "AI写作",
        icon: <Pencil size={35} />,
        "description": "集成AI写作工具，AI指导润色文章",
        link: "/notes/editor",
      }
    ]
  },
  {
    "category": "学习工具",
    "tools": [
      {
        "title": "文档阅读",
        link: "/notes/attach",
        icon: <FileText size={35} />,
        "description": "上传各类文档，分析文档中的关键内容信息"
      },
      {
        "title": "论文阅读",
        link: "/notes/attach", icon: <BookMarked size={35} />,
        "description": "上传学术论文，提炼出论文中最有价值的知识"
      },
      {
        "title": "图书阅读",
        link: "/notes/attach",
        icon: <Book size={35} />,
        "description": "导入电子书籍，分章节整理图书中的核心要点"
      }
    ]
  },
  {
    "category": "插件中心",
    "tools": [
      {
        "title": "公众号订阅",
        link: "/notes/attach",
        tag: "todo",
        icon: <MessageCircleIcon size={35} />,
        "description": "定时扫描公众号信息"
      },
      {
        "title": "Github收藏",
        tag: "todo",
        link: "/notes/attach",
        icon: <Github size={35} />,
        "description": "同步收藏的Github仓库列表，方便检索"
      },

    ]
  }
]



export default function ToolsPage() {
  return <div className="w-full h-full bg-gray-50 rounded-3xl p-5">
    {
      Categories.map(item => {
        return <div key={item.category} className="mt-5">
          <h1 className="p-5">{item.category}</h1>
          <div className="grid grid-cols-2 lg:grid-cols-3   gap-5">
            {
              item.tools.map(z => {
                return <Link href={z.link} key={z.title} className="bg-white border gap-2 border-white hover:border-gray-500 transition-all cursor-pointer rounded-3xl p-6   flex">
                  <div className="flex-1">
                    <div className="flex gap-1 items-center">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{z.title}
                      </h2>
                      {
                        ("tag" in z) && z.tag && <Chip size="sm" className="ml-2">{z.tag}</Chip>
                      }
                    </div>
                    <p className="text-gray-700">{z.description}</p>
                  </div>
                  <div className="flex justify-center mb-4">
                    {z.icon ?? <Image
                      width={60}
                      height={60}
                      src={IconApp} alt={z.title} className="h-12 w-12" />}
                  </div>

                </Link>
              })
            }
          </div>
        </div>
      })
    }

  </div>
}
