import { OpenAI } from "openai/client.js";
import dotenv from "dotenv"

dotenv.config();
const ai = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: process.env.BASEURL,
});

export default ai;
