export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { input } = req.body;

  if (!input || input.trim() === "") {
    return res.status(400).json({ error: "입력된 문장이 없습니다." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an English tutor. Correct the user's grammar. Show the corrected sentence and explain briefly why it was changed."
          },
          {
            role: "user",
            content: input
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "GPT 응답이 비정상적입니다." });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "서버 오류 발생: " + error.message });
  }
}
