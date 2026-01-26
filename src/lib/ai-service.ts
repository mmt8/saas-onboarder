export interface PageContext {
    url: string;
    elements: {
        tagName: string;
        text: string;
        selector: string;
        role?: string;
        placeholder?: string;
    }[];
}

export async function generateTourFromAI(context: PageContext) {
    const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context)
    });

    if (!response.ok) {
        throw new Error('Failed to generate tour with AI');
    }

    return response.json();
}

export async function improveContentWithAI(targetLabel: string, currentContent: string) {
    const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'improve',
            targetLabel,
            currentContent,
            url: window.location.pathname
        })
    });

    if (!response.ok) {
        throw new Error('Failed to improve content with AI');
    }

    const data = await response.json();
    return data.improvedContent;
}
