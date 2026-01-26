import { Step } from "@/store/tour-store";
import { getUniqueSelector } from "./dom-utils";
import { generateTourFromAI, PageContext } from "./ai-service";

/**
 * Scans the current page for interactive elements and prepares context for AI.
 */
export function scrapePageContext(): PageContext {
    const elements = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"]')) as HTMLElement[];

    const scoredElements = elements
        .filter(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width < 10 || rect.height < 10) return false;
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
            if (el.closest('.admin-toolbar-ignore')) return false;
            if (el.tagName === 'A' && !el.innerText.trim() && !el.getAttribute('aria-label')) return false;
            return true;
        })
        .map(el => ({
            element: el,
            score: scoreElement(el)
        }))
        .sort((a, b) => b.score - a.score);

    // Take top 20 elements to provide enough context without overwhelming AI
    const topCandidates = scoredElements.slice(0, 20);

    return {
        url: window.location.pathname,
        elements: topCandidates.map(candidate => {
            const el = candidate.element;
            return {
                tagName: el.tagName,
                text: getElementLabel(el),
                selector: getUniqueSelector(el),
                role: el.getAttribute('role') || undefined,
                placeholder: el.getAttribute('placeholder') || undefined
            };
        })
    };
}

/**
 * High-level function to generate a tour using AI.
 */
export async function generateTourWithAI(): Promise<Omit<Step, 'id' | 'order'>[]> {
    const context = scrapePageContext();
    return await generateTourFromAI(context);
}

/**
 * Legacy heuristic-based generator (fallback).
 */
export function generateTourHeuristic(): Omit<Step, 'id' | 'order'>[] {
    const context = scrapePageContext();
    // Use top 5 for heuristic
    return context.elements.slice(0, 5).map(el => ({
        target: el.selector,
        content: generateHeuristicContent(el)
    }));
}

function scoreElement(el: HTMLElement): number {
    let score = 0;
    const text = (el.innerText || '').toLowerCase();
    const isVisible = el.offsetParent !== null;
    if (!isVisible) return -100;

    if (text && text.trim().length > 0) score += 10;
    if (el.tagName === 'BUTTON') score += 5;
    if (el.tagName === 'A') score += 3;

    if (text.includes('sign up') || text.includes('get started') || text.includes('try free')) score += 15;
    if (text.includes('login') || text.includes('sign in')) score += 5;

    if (el.closest('nav')) score += 10;
    if (el.closest('header')) score += 8;
    if (el.closest('footer')) score -= 2;

    return score;
}

function generateHeuristicContent(el: any): string {
    const lowerLabel = el.text.toLowerCase().trim();

    for (const [key, value] of Object.entries(COMMON_TERMS)) {
        if (lowerLabel.includes(key)) return value;
    }

    if (el.tagName === 'INPUT' && el.placeholder) {
        return `Provide your ${el.placeholder.toLowerCase()} here to proceed with your setup.`;
    }

    return `Interact with this ${el.tagName.toLowerCase()} to explore more features.`;
}

const COMMON_TERMS: Record<string, string> = {
    'features': 'Explore the powerful features designed to streamline your workflow.',
    'pricing': 'Find the perfect plan that fits your needs.',
    'login': 'Log in to access your dashboard and saved projects.',
    'signup': 'Create your account today to unlock full access.',
    'get started': 'Begin setting up your workspace immediately.',
    'dashboard': 'View your analytics and manage recent projects.',
    'settings': 'Customize your experience and update your profile.',
};

function getElementLabel(el: HTMLElement): string {
    const text = el.innerText?.trim();
    if (text && text.length < 50) return text;
    const aria = el.getAttribute('aria-label');
    if (aria) return aria;
    const placeholder = el.getAttribute('placeholder');
    if (placeholder) return placeholder;
    if (el.id) return el.id;
    return 'Interactive element';
}
