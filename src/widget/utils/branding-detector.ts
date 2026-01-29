
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

    let primaryColor = '#E65221'; // Default internal fallback (Guidemark Orange)
    let fontFamily = 'Inter, sans-serif';
    let borderRadius = '12';
    let backgroundColor = '#ffffff';
    let foundColor = false;
    let foundFont = false;

    try {
        // 1. Detect Background Color (Body or first large container)
        const bodyStyle = window.getComputedStyle(document.body);
        if (bodyStyle.backgroundColor && bodyStyle.backgroundColor !== 'transparent' && bodyStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            backgroundColor = rgbToHex(bodyStyle.backgroundColor);
        }

        // 2. Detect Typography (Prioritize Headings then Body)
        const heading = document.querySelector('h1, h2, h3');
        if (heading) {
            const style = window.getComputedStyle(heading);
            if (style.fontFamily && style.fontFamily !== 'inherit') {
                fontFamily = style.fontFamily;
                foundFont = true;
            }
        }

        // 3. Detect Primary Color & Radius
        // We look for vibrant colors in common interactive elements
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
                // Ignore our own widget elements
                if (ignoreSelector && (el.closest(ignoreSelector) || el.classList.contains(ignoreSelector.replace('.', '')))) continue;

                const style = window.getComputedStyle(el);
                const bg = style.backgroundColor;

                if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                    const hex = rgbToHex(bg);

                    // We only accept non-neutral colors as "detected" primary colors
                    if (!isNeutral(hex, false)) {
                        primaryColor = hex;
                        foundColor = true;

                        // Grab border radius
                        const br = style.borderRadius;
                        if (br && br !== '0px') {
                            const firstRadius = br.split(' ')[0];
                            borderRadius = firstRadius.replace('px', '').replace('%', '');
                        }

                        // If font wasn't found from heading, take it from the button
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

        // 4. Try CSS Variables if no vibrant color found on buttons
        if (!foundColor) {
            const rootStyle = window.getComputedStyle(document.documentElement);
            const colorVars = ['--primary', '--brand', '--accent', '--main-color', '--primary-600', '--blue-600'];
            for (const v of colorVars) {
                const val = rootStyle.getPropertyValue(v).trim();
                if (val) {
                    const hex = val.startsWith('#') ? val : rgbToHex(val);
                    if (!isNeutral(hex, true)) {
                        primaryColor = hex;
                        foundColor = true;
                        break;
                    }
                }
            }
        }

        // Final fallback font check
        if (!foundFont && bodyStyle.fontFamily && bodyStyle.fontFamily !== 'inherit') {
            fontFamily = bodyStyle.fontFamily;
        }

        // IF NO VIBRANT COLOR FOUND, RETURN NULL
        // This allows the caller to handle the failure (e.g. show a fallback or error)
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

/**
 * Checks if a color is neutral (grey, black, or white).
 */
function isNeutral(color: string, lenient = false): boolean {
    try {
        const hex = color.startsWith('#') ? color : rgbToHex(color);
        if (!hex || hex.length < 7) return true;

        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        const diff1 = Math.abs(r - g);
        const diff2 = Math.abs(g - b);
        const diff3 = Math.abs(r - b);

        // Brownish colors have higher diffs than strictly neutral greys
        // Neutral greys have very low variance between R, G, and B.
        const tolerance = lenient ? 8 : 15;
        const isGrey = diff1 < tolerance && diff2 < tolerance && diff3 < tolerance;

        const isTooLight = r > 248 && g > 248 && b > 248;
        const isTooDark = r < 18 && g < 18 && b < 18;

        return isGrey || isTooLight || isTooDark;
    } catch (e) {
        return true;
    }
}

/**
 * Utility to convert RGB(A) to HEX.
 * Defaults to Guidemark Orange on failure.
 */
function rgbToHex(rgb: string): string {
    if (rgb.startsWith('#')) return rgb;
    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
    if (!match) return '#E65221';
    function hex(x: string) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
}

/**
 * Determines whether text should be black or white based on background contrast.
 */
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
