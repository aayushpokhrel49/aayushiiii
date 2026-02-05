import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are Aayushi, a professional AI assistant for a modern web application.

You are intelligent, fast, and precise like ChatGPT.
Your tone is confident, friendly, and clear — not rude, not childish.

Capabilities:
- Programming help
- Debugging
- System design
- Writing and summarization
- Logical reasoning
- Step-by-step explanations

Rules:
- No image generation
- No file uploads
- No browsing unless web results are provided
- Never claim access to private data
- Use markdown formatting
- Respond in the requested language

If web search results are provided, use them and cite sources at the end.`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            message,
            model = "llama-3.1-8b-instant",
            temperature = 0.7,
            max_tokens = 2048,
            useWeb = false,
            language = "English"
        } = body;

        // Validation
        if (!message || typeof message !== "string" || !message.trim()) {
            return NextResponse.json({ error: "Message is required and must be a non-empty string" }, { status: 400 });
        }

        const allowedModels = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile", "mixtral-8x7b-32768"];
        if (!allowedModels.includes(model)) {
            return NextResponse.json({ error: "Invalid model selected" }, { status: 400 });
        }

        let webResults = [];
        const isWebEnabled = useWeb || message.toLowerCase().startsWith("web:");

        if (isWebEnabled) {
            const query = message.toLowerCase().startsWith("web:")
                ? message.substring(4).trim()
                : message;

            if (query) {
                try {
                    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
                    const webRes = await fetch(`${baseUrl}/api/web`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ query }),
                    });

                    if (webRes.ok) {
                        webResults = await webRes.json();
                    } else {
                        console.warn(`Web search failed with status: ${webRes.status}`);
                    }
                } catch (err) {
                    console.error("Web search fetch failed:", err);
                }
            }
        }

        let fullPrompt = message;
        if (webResults.length > 0) {
            const context = webResults.map((r: any) => `- ${r.title}: ${r.snippet} (${r.href})`).join("\n");
            fullPrompt = `User Query: ${message}\n\nWeb Search Results:\n${context}\n\nPlease answer based on the results above and cite sources.`;
        }

        const stream = await groq.chat.completions.create({
            messages: [
                { role: "system", content: `${SYSTEM_PROMPT}\nRespond in ${language}.` },
                { role: "user", content: fullPrompt },
            ],
            model: model,
            temperature: Math.max(0, Math.min(2, temperature)),
            max_tokens: Math.max(1, Math.min(8192, max_tokens)),
            stream: true,
        });

        const readableStream = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || "";
                    if (content) {
                        controller.enqueue(new TextEncoder().encode(content));
                    }
                }
                controller.close();
            },
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "X-Sources": JSON.stringify(webResults),
            },
        });

    } catch (error: any) {
        console.error("Groq chat error:", error);
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred during chat completion" },
            { status: error.status || 500 }
        );
    }
}
