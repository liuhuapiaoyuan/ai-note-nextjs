# Next.js 14 AI Note App

This is a note-taking app with an integrated **AI chatbot**. By using the **ChatGPT API**, **vector embeddings**, and **Pinecone**, the chatbot knows about all notes stored in your user account and can retrieve relevant information to answer your questions and summarize information.

**Response streaming** is implemented via the **Vercel AI SDK**.

The app is built with Next.js 14's app router, TailwindCSS, Shadcn UI, and TypeScript. It has a light/dark theme toggle and a fully mobile-responsive layout.

Learn how to build this app in my tutorial: https://www.youtube.com/watch?v=mkJbEP5GeRA

![thumbnail](https://github.com/codinginflow/nextjs-ai-note-app/assets/52977034/cefc69f2-a486-4072-bf69-d0738f7336af)

### 技术栈

- nextjs
- next-auth
- authing [authing](https://www.authing.cn/) ,casdoor
- pinecone [pinecone](https://www.pinecone.io/)
- chatgpt [chatgpt](https://www.chatgpt.ai/)
- langchain
- vercel-ai-sdk [vercel-ai-sdk](https://vercel.com/docs/vercel-ai/overview)

### 页面预览

![alt text](doc/website.png)
![alt text](doc/notes.png)
![alt text](doc/app.png)![alt text](doc/editor.png)

### 1.1.1

#### 页面编排改造

- [x] 改善页面布局，优化交互逻辑
- [x] 优化对话，统一LLM配置，统一编辑器/管家对话逻辑
- [x] 修复管家的消息记录错误
- [ ] 显示训练中的训练状态
- [ ] 数据大盘，统计数量
- [ ] 文档对话显示引用的文章段落
- [ ] 文档对话优化回调响应
- [ ] 增加网页爬虫访问
- [ ] 增加Github收藏仓库授权同步

### 1.1.0

##### 版本改用清华智普，注意向量数据库的维度要改成1024 , 注册地址：` https://open.bigmodel.cn`

- [x] 改善笔记列表显示
- [x] 增加笔记类型： 备忘，文章
- [x] 增加笔记类型：文章编写（AI编辑器长文本编辑器）
- [x] 增强文档训练，引入langchain，进行text split chunk , 并训练文档
- [x] 增加笔记状态，通过异步任务训练
- [x] 页面动态训练任务状态
- [x] 增加新的‘网站首页’

- [x] 训练任务，异步话改造，引入可控的基于内存的异步任务管理
- [x] 新增附件文档训练，对接llamaparse云服务，需要配置key
- [x] 可以查看可用的文档训练数

### 1.0.0

- [x] next-auth集成，标准oidc集成
- [x] next-ui集成
- [x] 美化聊天对话记录
- [x] 美化聊天输入框
- [ ] 改善笔记列表显示
- [ ] 改善笔记录入体验，改为新开页面，markdown编辑器，可视化查看
- [ ] 增加笔记标签字段，并增加AI推荐标签
- [ ] 增加笔记分类，并增加分类功能

### 使用Docker进行编译和发布

- Dockerfile的编写
- docker build, docker tag, docker push
- docker-compose的编写
