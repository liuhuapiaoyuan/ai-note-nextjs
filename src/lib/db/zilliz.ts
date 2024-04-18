import {
  MilvusClient,
  SearchSimpleReq
} from "@zilliz/milvus2-sdk-node";
const zilliz_cloud_address = process.env.ZILLIZ_CLOUD_ADDRESS;
const collection_name = process.env.ZILLIZ_CLOUD_COLLECTION_NAME;

if (!zilliz_cloud_address) {
  throw Error("ZILLIZ_CLOUD_ADDRESS is not set");
}
if (!collection_name) {
  throw Error("ZILLIZ_CLOUD_COLLECTION_NAME is not set");
}

if (!process.env.ZILLIZ_CLOUD_TOKEN) {
  throw Error("ZILLIZ_CLOUD_TOKEN is not set");
}

export const client = new MilvusClient({
  address: zilliz_cloud_address,
  logLevel: "debug",
  username: "db_f1cf3c92f1a307e",
  password: "Qg9,Gs{V4K-/5$4Q"
});

export const notesIndex = {
  async upsert(data: Array<{
    id: string,
    values: number[],
    metadata: Record<string, any>
  }>) {
    await client.upsert({
      collection_name,
      data: data.map(z => ({
        vector: z.values,
        id: z.id,
        ...(z.metadata || {})

      })),
    });
  },
  async deleteOne(id: string) {
    await client.delete({
      collection_name,
      ids: [id]
    });
  },
  async query(data: {
    vector: number[],
    topK: number,
    filter?: Record<string, any>
  }) {

    const query: SearchSimpleReq = {
      collection_name,
      vector: data.vector,
      output_fields: ["id", "vector"],
      limit: data.topK,
    };

    if (data.filter) {
      query.filter = ""
      Object.keys(data.filter).forEach(key => {
        if (data.filter && data.filter[key]) {
          query.filter = query.filter ? `${query.filter} && ${key}=='${data.filter[key]}'` : `${key}=='${data.filter[key]}'`
        }
      })

    }
    const res = await client.search(query);
    return {
      matches: res.results
    }
  }
}
