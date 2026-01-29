/**
 * Samantha Persona: Value-Driven & Friendly
 * Style: "Empowerment & Clarity"
 */
const SAMANTHA_MAPPING: Record<string, { title: string, content: string }> = {
    'pricing': {
        title: 'Find Your Perfect Plan',
        content: "Choose the plan that fits your growth and unlocks our most powerful features."
    },
    'features': {
        title: 'Explore the Possibilities',
        content: "Discover how our tools empower your workflow and help you achieve more."
    },
    'dashboard': {
        title: 'Your Command Center',
        content: "Get a bird's-eye view of your progress and stay on top of what matters most."
    },
    'login': {
        title: 'Welcome Back!',
        content: "Step back into your productivity suite and pick up right where you left off."
    },
    'signup': {
        title: 'Start Your Journey',
        content: "Join us today and begin your path toward building something extraordinary."
    },
    'settings': {
        title: 'Make It Yours',
        content: "Tailor the platform to your unique needs and create your ideal working environment."
    },
    'documentation': {
        title: 'Master the Platform',
        content: "Everything you need to know to become a power user, simplified just for you."
    },
    'docs': {
        title: 'Master the Platform',
        content: "Everything you need to know to become a power user, simplified just for you."
    },
    'support': {
        title: 'We\'re Here for You',
        content: "Your success is our priority. Let us help you navigate any challenge you face."
    },
    'help': {
        title: 'We\'re Here for You',
        content: "Your success is our priority. Let us help you navigate any challenge you face."
    },
    'home': {
        title: 'Back to Base',
        content: "Return to the heart of the experience and start your next big thing."
    }
};

export function analyzeElement(element: HTMLElement) {
    const text = (element.innerText || element.textContent || '').trim();
    const ariaLabel = element.getAttribute('aria-label');
    const titleAttr = element.getAttribute('title');
    const placeholder = element.getAttribute('placeholder');
    const role = element.getAttribute('role');
    const tagName = element.tagName.toLowerCase();

    // Priority for identifying label: innerText > aria-label > title > placeholder
    const label = text || ariaLabel || titleAttr || placeholder || '';

    // Clean up label (remove newlines, extra spaces)
    const cleanLabel = label.replace(/\s+/g, ' ').trim();
    const lowerLabel = cleanLabel.toLowerCase();

    // 1. Check Samantha's custom mapping for specific keywords
    for (const [key, value] of Object.entries(SAMANTHA_MAPPING)) {
        if (lowerLabel.includes(key)) {
            return value;
        }
    }

    // 2. Fallback to generic but friendly patterns if no specific match
    const result = {
        title: 'Take the Next Step',
        content: 'Let\'s keep moving forward with the flow.'
    };

    if (tagName === 'button' || role === 'button' || (tagName === 'a' && (element.classList.contains('btn') || element.classList.contains('button')))) {
        result.title = cleanLabel ? `Explore ${cleanLabel}` : 'Ready to Proceed?';
        result.content = cleanLabel
            ? `Click into "${cleanLabel}" to see the value it brings to your process.`
            : 'Select this button to take the next meaningful step in your guide.';
    } else if (tagName === 'a' || role === 'link') {
        result.title = cleanLabel ? `Discover ${cleanLabel}` : 'Follow the Path';
        result.content = cleanLabel
            ? `Head over to "${cleanLabel}" to unlock more capabilities.`
            : 'Select this link to smoothly transition to the next part of your journey.';
    } else if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        const type = element.getAttribute('type');
        const fieldName = cleanLabel || placeholder || element.getAttribute('name') || 'this field';

        if (type === 'search') {
            result.title = `Find What You Need`;
            result.content = `Tell me what you're looking for, and let's find it together.`;
        } else {
            result.title = `Your Input Matters`;
            result.content = `Share your details in the ${fieldName} to personalize your experience.`;
        }
    } else if (cleanLabel) {
        result.title = cleanLabel;
        result.content = `Take a moment to appreciate ${cleanLabel} and how it fits into your goals.`;
    }

    return result;
}

export function discoverSteps() {
    const interactiveElements: { element: HTMLElement; rect: DOMRect }[] = [];

    // Find all potential interactive elements
    const candidates = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"]');

    candidates.forEach((el) => {
        const element = el as HTMLElement;

        // Skip hidden or tiny elements
        const rect = element.getBoundingClientRect();
        if (rect.width < 5 || rect.height < 5) return;

        // Skip elements that are likely part of our own UI
        if (element.closest('.admin-toolbar-ignore') || element.id === 'producttour-host') return;

        // Filter out hidden elements (opacity, visibility, etc.)
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

        interactiveElements.push({ element, rect });
    });

    // Sort by vertical position first, then horizontal (reading order)
    interactiveElements.sort((a, b) => {
        if (Math.abs(a.rect.top - b.rect.top) < 20) {
            return a.rect.left - b.rect.left;
        }
        return a.rect.top - b.rect.top;
    });

    // Limit to top 8 most significant elements to avoid overwhelming the tour
    const topElements = interactiveElements.slice(0, 8);

    return topElements.map(({ element }) => {
        const { title, content } = analyzeElement(element);
        return {
            element,
            title,
            content
        };
    });
}
