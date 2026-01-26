export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is missing");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: name }],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const raw = await response.text();
    console.log("OpenAI raw response:", raw);

    if (!response.ok) {
      return res.status(500).json({ error: raw });
    }

    const data = JSON.parse(raw);

    res.status(200).json({
      text: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("API ROUTE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}
