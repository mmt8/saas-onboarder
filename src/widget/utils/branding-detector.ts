
/**
 * Utility to detect branding from the host page.
 * Scans the DOM for primary colors, fonts, and border radii.
 */

export interface DetectedBranding {
    primaryColor: string;
    fontFamily: string;
    borderRadius: string;
    textColor: 'white' | 'black';
    backgroundColor: string;
}

/**
 * Scans the current document for branding elements.
 * Returns null if no non-neutral brand elements (vibrant colors) are found.
 */
export function detectBranding(ignoreSelector?: string): DetectedBranding | null {
    if (typeof window === 'undefined') return null;

    let primaryColor = '#495BFD'; // Intentional Blue Fallback
    let fontFamily = 'Inter, sans-serif';
    let borderRadius = '12';
    let backgroundColor = '#ffffff';
    let foundColor = false;
    let foundFont = false;

    try {
        // 1. Detect Background Color
        const bodyStyle = window.getComputedStyle(document.body);
        if (bodyStyle.backgroundColor && bodyStyle.backgroundColor !== 'transparent' && bodyStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            backgroundColor = rgbToHex(bodyStyle.backgroundColor);
        }

        // 2. Detect Typography (Prioritize serif headings for "Earthy" feel)
        const headings = document.querySelectorAll('h1, h2, h3, h4, .site-title, [class*="title"]');
        for (const h of Array.from(headings)) {
            const style = window.getComputedStyle(h);
            const font = style.fontFamily;
            if (font && font !== 'inherit' && !font.includes('Inter')) {
                fontFamily = font;
                foundFont = true;
                break;
            }
        }

        // 3. Detect Primary Color & Radius
        const primarySelectors = [
            'button[type="submit"]',
            'button.btn-primary',
            'button.primary',
            '.bg-primary',
            'a.btn-primary',
            '.cta',
            '.action-button',
            'button',
            'a.button',
            'input[type="submit"]',
            '[role="button"]'
        ];

        for (const selector of primarySelectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of Array.from(elements)) {
                if (ignoreSelector && (el.closest(ignoreSelector) || el.className?.includes?.('product-tour'))) continue;

                const style = window.getComputedStyle(el);
                const bg = style.backgroundColor;

                if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                    const hex = rgbToHex(bg);

                    // Accept any non-neutral color as a brand color
                    if (!isNeutral(hex)) {
                        primaryColor = hex;
                        foundColor = true;

                        const br = style.borderRadius;
                        if (br && br !== '0px') {
                            const firstRadius = br.split(' ')[0];
                            borderRadius = firstRadius.replace('px', '').replace('%', '');
                        }

                        if (!foundFont) {
                            fontFamily = style.fontFamily;
                            foundFont = true;
                        }

                        break;
                    }
                }
            }
            if (foundColor) break;
        }

        // 4. Return null if no vibrant color found to allow fallback to intentional Blue
        if (!foundColor) return null;

        const textColor = getContrastColor(primaryColor);

        return {
            primaryColor,
            fontFamily,
            borderRadius: borderRadius || '12',
            textColor,
            backgroundColor
        };
    } catch (e) {
        console.warn('Product Tour: Branding detection failed', e);
        return null;
    }
}

function isNeutral(color: string): boolean {
    try {
        const hex = color.startsWith('#') ? color : rgbToHex(color);
        if (!hex || hex.length < 7) return true;

        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        const diff1 = Math.abs(r - g);
        const diff2 = Math.abs(g - b);
        const diff3 = Math.abs(r - b);

        // Brown/Tan colors are non-neutral. Neutral colors have very similar RGB values.
        const tolerance = 8;
        const isGrey = diff1 < tolerance && diff2 < tolerance && diff3 < tolerance;

        const isTooLight = r > 248 && g > 248 && b > 248;
        const isTooDark = r < 22 && g < 22 && b < 22;

        return isGrey || isTooLight || isTooDark;
    } catch (e) {
        return true;
    }
}

function rgbToHex(rgb: string): string {
    if (rgb.startsWith('#')) return rgb;
    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
    if (!match) return '#495BFD'; // Restore Blue Fallback
    function hex(x: string) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
}

function getContrastColor(hexColor: string): 'white' | 'black' {
    try {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'black' : 'white';
    } catch (e) {
        return 'white';
    }
}
