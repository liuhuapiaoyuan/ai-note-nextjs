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
- vercel-ai-sdk [vercel-ai-sdk](https://vercel.com/docs/vercel-ai/overview)

### 1.1

- [ ] 改善笔记列表显示
- [ ] 增加笔记类型： 备忘，文章
- [ ] 增加笔记类型：文章编写

### 1.0

- [x] next-auth集成，标准oidc集成
- [x] next-ui集成
- [x] 美化聊天对话记录
- [x] 美化聊天输入框
- [ ] 改善笔记列表显示
- [ ] 改善笔记录入体验，改为新开页面，markdown编辑器，可视化查看
- [ ] 增加笔记标签字段，并增加AI推荐标签
- [ ] 增加笔记分类，并增加分类功能
- [ ] 增加笔记状态，通过redis异步训练文档，并更新状态
- [ ] 增强文档训练，引入langchain，进行text split chunk , 并训练文档

### 使用Docker进行编译和发布

- Dockerfile的编写
- docker build, docker tag, docker push
- docker-compose的编写
