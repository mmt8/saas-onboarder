import { Step } from "@/store/tour-store";
import { getUniqueSelector } from "./dom-utils";

/**
 * Scans the current page for interactive elements and generates a tour.
 */
export function generateTourFromPage(): Omit<Step, 'id' | 'order'>[] {
    // 1. Find all potential interactive elements
    const elements = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"]')) as HTMLElement[];

    // 2. Filter and score elements
    const scoredElements = elements
        .filter(el => {
            // Filter out hidden or tiny elements
            const rect = el.getBoundingClientRect();
            if (rect.width < 10 || rect.height < 10) return false;
            if (window.getComputedStyle(el).display === 'none') return false;
            if (window.getComputedStyle(el).visibility === 'hidden') return false;

            // Filter out elements inside the admin toolbar or editor
            if (el.closest('.admin-toolbar-ignore')) return false;

            return true;
        })
        .map(el => ({
            element: el,
            score: scoreElement(el)
        }))
        .sort((a, b) => b.score - a.score);

    // 3. Select top candidates (limit to 5-7 steps for a balanced tour)
    const topCandidates = scoredElements.slice(0, 5);

    // 4. Convert to Steps
    return topCandidates.map(candidate => {
        const el = candidate.element;
        const selector = getUniqueSelector(el);
        const label = getElementLabel(el);

        return {
            target: selector,
            content: `This is the ${label}. Click here to ${guessAction(el)}.`,
            action: 'click', // Default action
        };
    });
}

function scoreElement(el: HTMLElement): number {
    let score = 0;

    // Prioritize visible text
    if (el.innerText && el.innerText.trim().length > 0) score += 10;

    // Prioritize semantic tags
    if (el.tagName === 'BUTTON') score += 5;
    if (el.tagName === 'A') score += 3;
    if (el.tagName === 'INPUT') score += 2;

    // Prioritize elements with IDs
    if (el.id) score += 5;

    // Prioritize elements in navigation or header
    if (el.closest('nav')) score += 10;
    if (el.closest('header')) score += 8;
    if (el.closest('main')) score += 5;

    // Penalize elements deep in the DOM tree (likely less important)
    // score -= getDepth(el) * 0.5;

    return score;
}

function getElementLabel(el: HTMLElement): string {
    if (el.innerText && el.innerText.trim().length > 0) {
        return el.innerText.trim().slice(0, 20); // Truncate long text
    }
    if (el.getAttribute('aria-label')) return el.getAttribute('aria-label')!;
    if (el.getAttribute('placeholder')) return el.getAttribute('placeholder')!;
    if (el.id) return el.id;
    return el.tagName.toLowerCase();
}

function guessAction(el: HTMLElement): string {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return 'enter text';
    if (el.tagName === 'SELECT') return 'select an option';
    return 'proceed';
}
