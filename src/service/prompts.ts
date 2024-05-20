/* eslint-disable spaced-comment */
import { PromptTemplate } from "@langchain/core/prompts";

const template = `你是一名专门总结内容的专家，请用简单的语句总结下面内容，如果内容无法总结，请你直接返回‘无意义内容’，不要解释
--

{text}

--
CONCISE SUMMARY:`;

export const DEFAULT_PROMPT = /*#__PURE__*/ new PromptTemplate({
  template,
  inputVariables: ["text"],
});
