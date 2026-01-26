export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Check that the API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is missing");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const { name } = req.body;

    // Ensure prompt is provided
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Missing or invalid prompt" });
    }

    // Call OpenAI API
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

    // Parse JSON safely
    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({ error: data });
    }

    // Return AI text
    res.status(200).json({
      text: data.choices?.[0]?.message?.content || "No content returned",
    });
  } catch (error) {
    console.error("API ROUTE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}
