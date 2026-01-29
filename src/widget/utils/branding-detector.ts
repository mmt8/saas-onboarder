
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

export function detectBranding(ignoreSelector?: string): DetectedBranding | null {
    if (typeof window === 'undefined') return null;

    let primaryColor = '#495BFD'; // Temporary internal default
    let fontFamily = 'Inter, sans-serif';
    let borderRadius = '12';
    let backgroundColor = '#ffffff';

    try {
        // 1. Detect Background Color (from body or first large container)
        const bodyStyle = window.getComputedStyle(document.body);
        if (bodyStyle.backgroundColor && bodyStyle.backgroundColor !== 'transparent' && bodyStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            backgroundColor = rgbToHex(bodyStyle.backgroundColor);
        }

        // 2. Detect Font Family (Heading prioritization)
        const heading = document.querySelector('h1, h2, h3');
        if (heading) {
            const style = window.getComputedStyle(heading);
            if (style.fontFamily && style.fontFamily !== 'inherit') {
                fontFamily = style.fontFamily;
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
            'button',
            'a.button',
            'a.btn',
            '[role="button"]'
        ];

        let foundColor = false;
        for (const selector of primarySelectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of Array.from(elements)) {
                // Ignore our own widget
                if (ignoreSelector && el.closest(ignoreSelector)) continue;

                const style = window.getComputedStyle(el);
                const bg = style.backgroundColor;

                if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                    const hex = rgbToHex(bg);
                    if (!isNeutral(hex)) {
                        primaryColor = hex;
                        foundColor = true;

                        // Grab radius
                        const br = style.borderRadius;
                        if (br && br !== '0px') {
                            const firstRadius = br.split(' ')[0];
                            borderRadius = firstRadius.replace('px', '').replace('%', '');
                        }

                        // Font if not yet found
                        if (fontFamily === 'Inter, sans-serif') {
                            fontFamily = style.fontFamily;
                        }

                        break;
                    }
                }
            }
            if (foundColor) break;
        }

        // 4. Check CSS Variables for primary/accent
        if (!foundColor) {
            const rootStyle = window.getComputedStyle(document.documentElement);
            const colorVars = ['--primary', '--accent', '--brand-color', '--main-color', '--primary-600', '--blue-600'];
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

        // 5. Contrast & Text Color
        const textColor = getContrastColor(primaryColor);

        return {
            primaryColor: foundColor ? primaryColor : '#495BFD', // Keep internal but mark as found
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

function isNeutral(color: string, strict = false): boolean {
    try {
        const hex = color.startsWith('#') ? color : rgbToHex(color);
        if (!hex || hex.length < 7) return true;

        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        const diff1 = Math.abs(r - g);
        const diff2 = Math.abs(g - b);
        const diff3 = Math.abs(r - b);

        // Brownish colors have higher diffs, so they aren't grey.
        // Strict mode (for CSS vars) is more lenient.
        const tolerance = strict ? 10 : 20;
        const isGrey = diff1 < tolerance && diff2 < tolerance && diff3 < tolerance;

        const isTooLight = r > 250 && g > 250 && b > 250;
        const isTooDark = r < 10 && g < 10 && b < 10;

        return isGrey || isTooLight || isTooDark;
    } catch (e) {
        return true;
    }
}

function rgbToHex(rgb: string): string {
    if (rgb.startsWith('#')) return rgb;
    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
    if (!match) return '#495BFD'; // Still internal default, but we'll try to find better
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
