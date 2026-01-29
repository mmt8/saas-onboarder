
/**
 * Utility to detect branding from the host page.
 * Scans the DOM for primary colors, fonts, and border radii.
 */

export interface DetectedBranding {
    primaryColor: string;
    fontFamily: string;
    borderRadius: string;
    textColor: 'white' | 'black';
}

export function detectBranding(): DetectedBranding | null {
    if (typeof window === 'undefined') return null;

    let primaryColor = '#495BFD'; // Default fallback
    let fontFamily = 'Inter, sans-serif';
    let borderRadius = '12';

    try {
        // 1. Detect Primary Color
        // Strategy: Look for the first prominent button or a major CSS variable
        const primarySelectors = [
            'button[type="submit"]',
            'button.btn-primary',
            'button.primary',
            '.bg-primary',
            'a.btn-primary',
            '.cta',
            '.action-button',
            'button',
            '[role="button"]'
        ];

        let foundColor = false;
        for (const selector of primarySelectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of Array.from(elements)) {
                const style = window.getComputedStyle(el);
                const bg = style.backgroundColor;

                // Skip if transparent or neutral (to avoid grabbing background colors)
                if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                    const hex = rgbToHex(bg);

                    // Prioritize vibrant colors over neutrals
                    if (!isNeutral(hex) || !foundColor) {
                        primaryColor = hex;
                        foundColor = true;

                        // Grab radius from the same element
                        const br = style.borderRadius;
                        if (br && br !== '0px') {
                            const firstRadius = br.split(' ')[0];
                            borderRadius = firstRadius.replace('px', '').replace('%', '');
                        }

                        // Grab font if possible
                        const font = style.fontFamily;
                        if (font && font !== 'inherit') {
                            fontFamily = font;
                        }

                        // If we found a vibrant color, we stop. If we only found neutral, we keep looking for vibrant.
                        if (!isNeutral(hex)) break;
                    }
                }
            }
            if (foundColor && !isNeutral(primaryColor)) break;
        }

        // If no button found or only neutral found, look for accent color in CSS vars
        if (!foundColor || isNeutral(primaryColor)) {
            const rootStyle = window.getComputedStyle(document.documentElement);
            const colorVars = ['--primary', '--accent', '--brand-color', '--main-color', '--primary-600', '--blue-600'];
            for (const v of colorVars) {
                const val = rootStyle.getPropertyValue(v).trim();
                if (val) {
                    const hex = val.startsWith('#') ? val : rgbToHex(val);
                    if (!isNeutral(hex)) {
                        primaryColor = hex;
                        foundColor = true;
                        break;
                    }
                }
            }
        }

        // 2. Detect Font Family (Body fallback)
        const bodyStyle = window.getComputedStyle(document.body);
        const bodyFont = bodyStyle.fontFamily;
        if (bodyFont && bodyFont !== 'inherit' && fontFamily === 'Inter, sans-serif') {
            fontFamily = bodyFont;
        }

        // 3. Determine Text Color (Contrast)
        const textColor = getContrastColor(primaryColor);

        return {
            primaryColor,
            fontFamily,
            borderRadius: borderRadius || '12',
            textColor
        };
    } catch (e) {
        console.warn('Product Tour: Branding detection failed', e);
        return null;
    }
}

function isNeutral(color: string): boolean {
    // Simple check for grey/black/white
    try {
        const hex = color.startsWith('#') ? color : rgbToHex(color);
        if (!hex || hex.length < 7) return true;

        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        const diff1 = Math.abs(r - g);
        const diff2 = Math.abs(g - b);
        const diff3 = Math.abs(r - b);

        const isGrey = diff1 < 15 && diff2 < 15 && diff3 < 15;
        const isTooLight = r > 245 && g > 245 && b > 245;
        const isTooDark = r < 20 && g < 20 && b < 20;

        return isGrey || isTooLight || isTooDark;
    } catch (e) {
        return true;
    }
}

function rgbToHex(rgb: string): string {
    if (rgb.startsWith('#')) return rgb;
    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
    if (!match) return '#495BFD';
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
