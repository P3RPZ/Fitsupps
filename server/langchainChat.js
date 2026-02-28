const dotenv = require("dotenv");
const path = require("path");

// Ensure environment variables (like GOOGLE_API_KEY) are loaded
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

/**
 * Simple LangChain-powered chat helper.
 * Uses dynamic import so we can consume ESM-only LangChain packages
 * from this CommonJS-based project without changing module type.
 */
async function runChat(message) {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not set in environment");
  }

  // Dynamically import ESM LangChain packages
  const { ChatGoogleGenerativeAI } = await import("@langchain/google-genai");
  const { ChatPromptTemplate } = await import("@langchain/core/prompts");

  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    temperature: 0.3,
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful, concise assistant for an online supplements store called Fitsupps. Answer clearly and avoid making medical claims.",
    ],
    ["human", "{input}"],
  ]);

  const chain = prompt.pipe(llm);
  const response = await chain.invoke({ input: message });

  // response.content is usually a string; fall back just in case
  return typeof response.content === "string"
    ? response.content
    : JSON.stringify(response.content);
}

module.exports = {
  runChat,
};
