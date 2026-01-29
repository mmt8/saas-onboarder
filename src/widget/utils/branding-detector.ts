
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

    let primaryColor = '#E65221'; // Internal default (Guidemark Orange)
    let fontFamily = 'Inter, sans-serif';
    let borderRadius = '12';
    let backgroundColor = '#ffffff';
    let foundColor = false;
    let foundFont = false;

    try {
        // 1. Detect Background Color (Improves preview realism)
        const bodyStyle = window.getComputedStyle(document.body);
        if (bodyStyle.backgroundColor && bodyStyle.backgroundColor !== 'transparent' && bodyStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            backgroundColor = rgbToHex(bodyStyle.backgroundColor);
        }

        // 2. Detect Typography (Prioritize Headings)
        const heading = document.querySelector('h1, h2, h3, h4');
        if (heading) {
            const style = window.getComputedStyle(heading);
            if (style.fontFamily && style.fontFamily !== 'inherit') {
                fontFamily = style.fontFamily;
                foundFont = true;
            }
        }

        // 3. Detect Primary Color & Radius (Aggressive Scrape)
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
                // Ignore widget elements to prevent "detecting self"
                if (ignoreSelector && (el.closest(ignoreSelector) || el.className?.includes?.('product-tour'))) continue;

                const style = window.getComputedStyle(el);
                const bg = style.backgroundColor;

                if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                    const hex = rgbToHex(bg);

                    // Earthy colors might have lower saturation, so we adjust neutral checks
                    if (!isNeutral(hex)) {
                        primaryColor = hex;
                        foundColor = true;

                        // Grab border radius
                        const br = style.borderRadius;
                        if (br && br !== '0px') {
                            const firstRadius = br.split(' ')[0];
                            borderRadius = firstRadius.replace('px', '').replace('%', '');
                        }

                        // Font if not yet found
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

        // 4. Fallback to CSS Variables (Common for modern brands)
        if (!foundColor) {
            const rootStyle = window.getComputedStyle(document.documentElement);
            const colorVars = ['--primary', '--brand', '--accent', '--main-color', '--primary-600', '--blue-600', '--indigo-600'];
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

        // Final font fallback
        if (!foundFont && bodyStyle.fontFamily && bodyStyle.fontFamily !== 'inherit') {
            fontFamily = bodyStyle.fontFamily;
        }

        // CRITICAL: If no vibrant "brand" color was found, return null.
        // This prevents returning a default blue/orange and forces the caller to use its OWN brand.
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

        // Very tight tolerance for neutrals, allowing earthy/saturated colors to pass
        const tolerance = 10;
        const isGrey = diff1 < tolerance && diff2 < tolerance && diff3 < tolerance;

        const isTooLight = r > 248 && g > 248 && b > 248;
        const isTooDark = r < 20 && g < 20 && b < 20;

        return isGrey || isTooLight || isTooDark;
    } catch (e) {
        return true;
    }
}

function rgbToHex(rgb: string): string {
    if (rgb.startsWith('#')) return rgb;
    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
    if (!match) return '#E65221'; // Default to Brand Orange
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
