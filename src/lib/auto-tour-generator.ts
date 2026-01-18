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
            // Strict visibility check
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;

            // Filter out elements inside the admin toolbar or editor
            if (el.closest('.admin-toolbar-ignore')) return false;

            // Filter out purely layout links (like empty anchors)
            if (el.tagName === 'A' && !el.innerText.trim() && !el.getAttribute('aria-label')) return false;

            return true;
        })
        .map(el => ({
            element: el,
            score: scoreElement(el)
        }))
        .sort((a, b) => b.score - a.score);

    // 3. Select top candidates (limit to 5-7 steps for a balanced tour)
    // We try to pick a diverse set of elements (Nav > Hero CTA > Feature > Footer) if possible, but simple slicing works for now.
    const topCandidates = scoredElements.slice(0, 5);

    // 4. Convert to Steps
    return topCandidates.map(candidate => {
        const el = candidate.element;
        const selector = getUniqueSelector(el);
        const content = generateSmartContent(el);

        return {
            target: selector,
            content: content
        };
    });
}

function scoreElement(el: HTMLElement): number {
    let score = 0;

    const text = (el.innerText || '').toLowerCase();
    const isVisible = el.offsetParent !== null;

    if (!isVisible) return -100;

    // Prioritize visible text
    if (text && text.trim().length > 0) score += 10;

    // Semantic Tags
    if (el.tagName === 'BUTTON') score += 5;
    if (el.tagName === 'A') score += 3;

    // Key Interactions
    if (text.includes('sign up') || text.includes('get started') || text.includes('try free')) score += 15;
    if (text.includes('login') || text.includes('sign in')) score += 5;

    // Locations
    if (el.closest('nav')) score += 10;
    if (el.closest('header')) score += 8;
    if (el.closest('footer')) score -= 2; // Footer links usually less important for onboarding

    return score;
}

// --- Semantic Copy Generation ---

const COMMON_TERMS: Record<string, string> = {
    'features': 'Explore the powerful features designed to streamline your workflow and boost productivity.',
    'pricing': 'Find the perfect plan that fits your needs, from individual tiers to enterprise solutions.',
    'login': 'Already have an account? Log in to access your dashboard and saved projects.',
    'sign in': 'Log in to access your account settings and pick up where you left off.',
    'signup': 'Create your account today to unlock full access and get started immediately.',
    'sign up': 'Create your account today to unlock full access and get started immediately.',
    'register': 'Registration is quick and easy. Join our community in just a few clicks.',
    'get started': 'Begin setting up your workspace and configuring your preferences right now.',
    'contact': 'Have questions? Reach out to our support team for personalized assistance.',
    'about': 'Learn more about our mission, vision, and the team behind the platform.',
    'dashboard': 'View your analytics, manage recent projects, and track overall progress.',
    'settings': 'Customize your experience, manage notifications, and update your profile details.',
    'profile': 'Manage your personal information and account security settings.',
    'docs': 'Browse our comprehensive guides and API references to master the platform.',
    'learn more': 'Get detailed information about this feature and how it benefits you.',
};

function generateSmartContent(el: HTMLElement): string {
    const rawLabel = getElementLabel(el);
    const lowerLabel = rawLabel.toLowerCase().trim();

    // 1. Dictionary Match (Exact or Partial)
    for (const [key, value] of Object.entries(COMMON_TERMS)) {
        if (lowerLabel.includes(key)) {
            return value;
        }
    }

    // 2. Contextual Fallbacks
    if (el.closest('nav')) {
        return `Quickly access the ${rawLabel} section to manage your workflow.`;
    }

    if (el.tagName === 'INPUT') {
        const placeholder = el.getAttribute('placeholder');
        if (placeholder) {
            return `Provide your ${placeholder.toLowerCase()} here to proceed with your setup.`;
        }
        return `Enter the required information in this field to continue.`;
    }

    // 3. Generic Action-Oriented Fallback
    const actionVerb = getActionVerb(el);
    return `${actionVerb} this element to access more options or details.`;
}

function getElementLabel(el: HTMLElement): string {
    const text = el.innerText?.trim();
    if (text && text.length < 30) return capitalize(text);

    const aria = el.getAttribute('aria-label');
    if (aria) return capitalize(aria);

    const placeholder = el.getAttribute('placeholder');
    if (placeholder) return capitalize(placeholder);

    if (el.id) return capitalize(el.id.replace(/[-_]/g, ' '));

    return 'Item';
}

function getActionVerb(el: HTMLElement): string {
    if (el.tagName === 'BUTTON') return 'Click';
    if (el.tagName === 'A') return 'Select';
    if (el.tagName === 'INPUT') return 'Fill out';
    return 'Interact with';
}

function capitalize(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
