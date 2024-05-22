

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { HtmlToTextTransformer } from "@langchain/community/document_transformers/html_to_text";




async function SimpleWebLoader(url: string, selector: string) {
  const loader = new CheerioWebBaseLoader(
    url,
    {
      selector: ".content.with-sidebar"
    }
  );
  const docs = await loader.load();

  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
    chunkSize: 1000
  });
  const transformer = new HtmlToTextTransformer();
  const sequence = splitter.pipe(transformer);
  return await sequence.invoke(docs);
}
/**
 * 批量扫描
 * @param urls 
 * @param selector 
 * @returns 
 */
export async function BatchSimpleWebLoader(urls: string[], selector: string) {
  const docs = await Promise.all(urls.map(url => SimpleWebLoader(url, selector)));
  return docs.flat();
}
