


import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { HtmlToTextTransformer } from "@langchain/community/document_transformers/html_to_text";


export async function GET() {
  const loader = new CheerioWebBaseLoader(
    "https://doc.fastadmin.net/developer/79.html",
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
  const newDocuments = await sequence.invoke(docs);
  return Response.json({
    data: newDocuments.map((doc) => (doc.pageContent)),
  });

}
