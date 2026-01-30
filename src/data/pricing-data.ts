export interface PricingTier {
    mau: number;
    label: string;
    monthlyPrice: number | string;
    annualPricePerMonth: number | string;
}

export const PRICING_CONFIG = {
    currency: "€",
    discountLabel: "Save 20%",
    tiers: [
        { mau: 1500, label: "1.5k", monthlyPrice: 24, annualPricePerMonth: 19 },
        { mau: 3000, label: "3k", monthlyPrice: 39, annualPricePerMonth: 29 },
        { mau: 5000, label: "5k", monthlyPrice: 49, annualPricePerMonth: 39 },
        { mau: 10000, label: "10k", monthlyPrice: 69, annualPricePerMonth: 49 },
        { mau: 20000, label: "20k", monthlyPrice: 89, annualPricePerMonth: 69 },
        { mau: 50000, label: "50k", monthlyPrice: "Let's Talk", annualPricePerMonth: "Let's Talk" },
        { mau: 100000, label: "100k+", monthlyPrice: "Let's Talk", annualPricePerMonth: "Let's Talk" },
    ] as PricingTier[],
    features: [
        "Unlimited Product Tours",
        "High-Fidelity Guidance Engine",
        "No-Code Visual Editor",
        "Smart Element Targeting",
        "Analytics & Conversion Tracking",
        "Multi-domain Support",
        "Custom Branding & Themes",
        "Priority Support",
    ],
};
