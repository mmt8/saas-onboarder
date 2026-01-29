
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

    let primaryColor = '#495BFD'; // Fallback will be handled by the caller too
    let fontFamily = 'Inter, sans-serif';
    let borderRadius = '12';

    try {
        // 1. Detect Font Family FIRST (Headings usually define the brand)
        const heading = document.querySelector('h1, h2, h3');
        if (heading) {
            const style = window.getComputedStyle(heading);
            const font = style.fontFamily;
            if (font && font !== 'inherit') {
                fontFamily = font;
            }
        }

        // 2. Detect Primary Color & Radius
        const primarySelectors = [
            'button[type="submit"]',
            'button.btn-primary',
            'button.primary',
            '.bg-primary',
            'a.btn-primary',
            '.cta',
            '.action-button',
            'button',
            '[role="button"]',
            'button' // Fallback to any button
        ];

        let foundColor = false;

        // Find the most prominent non-neutral button
        for (const selector of primarySelectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of Array.from(elements)) {
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

                        // If we didn't get a font from heading, try from button
                        if (fontFamily === 'Inter, sans-serif') {
                            const btnFont = style.fontFamily;
                            if (btnFont && btnFont !== 'inherit') {
                                fontFamily = btnFont;
                            }
                        }

                        break;
                    }
                }
            }
            if (foundColor) break;
        }

        // 3. Look for CSS variables if still no luck
        if (!foundColor) {
            const rootStyle = window.getComputedStyle(document.documentElement);
            const colorVars = ['--primary', '--accent', '--brand-color', '--main-color', '--primary-600', '--blue-600', '--indigo-600'];
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

        // 4. Fallback font from body if still Inter
        if (fontFamily === 'Inter, sans-serif') {
            const bodyStyle = window.getComputedStyle(document.body);
            if (bodyStyle.fontFamily && bodyStyle.fontFamily !== 'inherit') {
                fontFamily = bodyStyle.fontFamily;
            }
        }

        // 5. Determine Text Color (Contrast)
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
        const isTooLight = r > 248 && g > 248 && b > 248;
        const isTooDark = r < 15 && g < 15 && b < 15;

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
