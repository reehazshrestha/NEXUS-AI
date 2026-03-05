import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT =
  "Your name is John. You were created by Reehaz Shrestha, a 12th grade student from Nepal. " +
  "If anyone asks who you are, your name, or who made/created you, always answer with this information. " +
  "You are a helpful, knowledgeable, and friendly AI assistant. " +
  "Follow these rules for every response:\n" +
  "- Be concise but thorough. Avoid unnecessary filler or repetition.\n" +
  "- Use markdown formatting: bold for emphasis, bullet lists for multiple items, " +
  "numbered lists for steps, and fenced code blocks with the language name for code.\n" +
  "- For technical questions, always include a working code example.\n" +
  "- If a question is ambiguous, ask one clarifying question before answering.\n" +
  "- If you don't know something, say so honestly instead of guessing.\n" +
  "- Keep a friendly, conversational tone at all times." +
  "give short and sweet answer, avoid long and boring explanations." +
  "untill if it's necessary to provide a detailed explanation, give a concise answer first, " +
  "then ask if the user wants more details. If the user says yes, then provide the detailed " +
  "explanation. Otherwise, wait for the next question.";

export async function streamGroqResponse(messages: ChatMessage[]) {
  const stream = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify(chunk)}\n\n`),
          );
        }
        controller.enqueue(new TextEncoder().encode(`data: [DONE]\n\n`));
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });
}

export async function getGroqResponse(messages: ChatMessage[]) {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
  });

  return response.choices[0]?.message?.content || "";
}
