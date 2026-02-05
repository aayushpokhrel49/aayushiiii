import { NextResponse } from "next/server";
import Exa from "exa-js";

const exa = new Exa(process.env.EXA_API_KEY!);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { query } = body;

        if (!query || typeof query !== "string" || !query.trim()) {
            return NextResponse.json({ error: "Query is required and must be a non-empty string" }, { status: 400 });
        }

        const result = await exa.searchAndContents(query, {
            numResults: 5,
            useAutoprompt: true,
            highlights: true,
        });

        const formattedResults = result.results.map((r: any) => ({
            title: r.title || "No title",
            href: r.url,
            snippet: r.highlights?.[0] || r.text?.substring(0, 200) + "..." || "No snippet available",
        }));

        return NextResponse.json(formattedResults);
    } catch (error: any) {
        console.error("Exa search error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to perform web search" },
            { status: 500 }
        );
    }
}
