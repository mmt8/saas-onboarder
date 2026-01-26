import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { url, elements, type = 'generate', currentContent, targetLabel } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
        }

        let prompt = '';
        if (type === 'improve') {
            prompt = `
                You are an AI Ghost-Writer for product walkthroughs.
                Improve the following onboarding copy for a UI element labeled "${targetLabel}".
                
                Current copy: "${currentContent}"
                URL: ${url}

                Return a JSON object:
                {
                    "improvedContent": "Better, more engaging, adoption-focused copy"
                }

                Only return JSON.
            `;
        } else {
            prompt = `
                You are an AI Ghost-Writer for product walkthroughs.
                Analyze the following interactive elements from a webpage (URL: ${url}) and generate a coherent 5-step onboarding tour.
                
                Elements:
                ${JSON.stringify(elements, null, 2)}

                Return a JSON array of objects:
                [
                    {
                        "target": "css-selector",
                        "content": "Helpful, engaging onboarding copy"
                    }
                ]

                Only return JSON.
            `;
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                }
            })
        });

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiText) throw new Error('No response from Gemini');

        const result = JSON.parse(aiText);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('AI Generation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
