export interface PricingTier {
    mau: number;
    label: string;
    monthlyPrice: number | string;
    annualPricePerMonth: number | string;
}

export const PRICING_CONFIG = {
    currency: "$",
    discountLabel: "Save 25%",
    tiers: [
        { mau: 1500, label: "1.5k", monthlyPrice: 199, annualPricePerMonth: 149 },
        { mau: 3000, label: "3k", monthlyPrice: 299, annualPricePerMonth: 224 },
        { mau: 5000, label: "5k", monthlyPrice: 349, annualPricePerMonth: 262 },
        { mau: 10000, label: "10k", monthlyPrice: 499, annualPricePerMonth: 374 },
        { mau: 25000, label: "25k", monthlyPrice: 799, annualPricePerMonth: 599 },
        { mau: 50000, label: "50k", monthlyPrice: 1299, annualPricePerMonth: 974 },
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
