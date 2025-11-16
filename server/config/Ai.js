import { OpenAI } from "openai/client.js";

const ai = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: process.env.BASEURL,
});


export default ai