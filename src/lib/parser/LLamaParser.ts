

export enum JobStatus {
  //PENDING, SUCCESS, ERROR, CANCELED
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  CANCELED = 'CANCELED',
}

class LLamaParser {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.LLAMA_CLOUD_API_KEY || '';
  }


  /**
   * 创建解析任务 并返回一个ID
   * @param file 
   * @returns 
   */
  async createJob(file: File, options?: {
    language?: string[]
    /**
     * 解析指令
     */
    parsing_instruction?: string
  }): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const language = options?.language ?? ["en", "ch_sim", "ch_tra"];
    language.forEach(z => {
      formData.append('language', z);
    })

    const headers = new Headers({
      Authorization: `Bearer ${this.apiKey}`,
    });


    try {
      const response = await fetch('https://api.cloud.llamaindex.ai/api/parsing/upload', {
        method: 'POST',
        body: formData,
        headers: headers,
      });
      const data = await response.json();
      return data.id as string;
    } catch (error) {
      throw new Error('Error uploading file: ' + JSON.stringify(error));
    }
  }
  /**
   * 获得任务ID
   * @param jobId 
   * @returns 
   */
  async checkJobStatus(jobId: string): Promise<{ id: string, status: JobStatus }> {
    const headers = new Headers({
      Authorization: `Bearer ${this.apiKey}`,
    });

    const options: RequestInit = {
      method: 'GET',
      headers: headers,
    };

    try {
      const response = await fetch(`https://api.cloud.llamaindex.ai/api/parsing/job/${jobId}`, options);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error checking job status: ' + JSON.stringify(error));
    }
  }
  /**
   * 获得解析结果
   * @param jobId 
   * @param format 
   * @returns 
   */
  async getResult(jobId: string): Promise<string> {
    const headers = new Headers({
      Authorization: `Bearer ${this.apiKey}`,
    });

    const options: RequestInit = {
      method: 'GET',
      headers: headers,
    };

    try {
      const response = await fetch(`https://api.cloud.llamaindex.ai/api/parsing/job/${jobId}/result/markdown`, options);
      const data = await response.json();
      return data.markdown
    } catch (error) {
      throw new Error('Error getting result: ' + JSON.stringify(error));
    }
  }
  //获得使用量
  async usage() {
    const headers = new Headers({
      Authorization: `Bearer ${this.apiKey}`,
    });

    const options: RequestInit = {
      method: 'GET',
      headers: headers,
    };
    const resp = await fetch('https://api.cloud.llamaindex.ai/api/parsing/usage', options)
    const data = await resp.json() as ({ usage_pdf_pages: number, max_pdf_pages: number })
    return data
  }
}

export default LLamaParser;
