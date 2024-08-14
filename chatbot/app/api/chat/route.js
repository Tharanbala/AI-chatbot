import {NextResponse} from 'next/server' // Import NextResponse from Next.js for handling responses

export async function POST(req) {
    const data = await req.json()

    const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: data.embedding }),
      });
    const result = await response.json();
    const formattedResults = result.map(item => `URL: ${item.id}, Score: ${item.score}`).join("\n");

    const contextMessage = {
        role: "system",
        content: `Context: ${formattedResults}`
    };

    const messagesWithContext = [contextMessage, ...data.messages];

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesWithContext,
          model: "gpt-4o-mini",
        }),
      });
    
    const openaiResult = await openaiResponse.json();

    return new NextResponse(JSON.stringify(openaiResult.choices[0].message.content))
}