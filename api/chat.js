import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

import { kshitijPrompt, abhimanyuPrompt, anshumanPrompt } from "../prompts.js";

const prompts = {
  kshitij: kshitijPrompt,
  abhimanyu: abhimanyuPrompt,
  anshuman: anshumanPrompt,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { persona, messages } = req.body;

    if (!prompts[persona]) {
      return res.status(400).json({ error: "Invalid persona" });
    }

    const response = await client.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        { role: "system", content: prompts[persona] },
        ...messages,
      ],
    });

    res.status(200).json({
      reply: response.choices[0].message.content,
    });

  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
}