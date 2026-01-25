import OpenAI from "openai";

const Openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    // Prompt construction (kept compatible with your frontend)
    const beforePrompt = "";
    const afterPrompt = "";
    const breakPoint = "\n\n'''\n\n";

    const prompt = `${beforePrompt}${breakPoint}${name}${breakPoint}${afterPrompt}`;

    console.log("PROMPT:", prompt);

    // OpenAI call (modern API)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    res.status(200).json({
      text: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
