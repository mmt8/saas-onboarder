export function getUniqueSelector(element: HTMLElement): string {
    if (element.id) {
        return `#${element.id}`;
    }

    const path: string[] = [];
    let current: HTMLElement | null = element;

    while (current && current.tagName !== 'BODY') {
        let selector = current.tagName.toLowerCase();

        if (current.className && typeof current.className === 'string') {
            // Filter out Tailwind dynamic classes or common utility classes if needed
            // For now, we'll use the first meaningful class or just the tag
            const classes = current.className.split(' ').filter(c => !c.startsWith('hover:') && !c.startsWith('focus:'));
            if (classes.length > 0) {
                selector += `.${classes[0]}`;
            }
        }

        // Add nth-child if needed for uniqueness
        const parent = current.parentElement;
        if (parent) {
            const siblings = Array.from(parent.children).filter(c => c.tagName === current!.tagName);
            if (siblings.length > 1) {
                const index = Array.from(parent.children).indexOf(current) + 1;
                selector += `:nth-child(${index})`;
            }
        }

        path.unshift(selector);
        current = current.parentElement;
    }

    return path.join(' > ');
}
