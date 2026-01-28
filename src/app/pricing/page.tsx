"use client";

import * as React from "react";
import { PRICING_CONFIG } from "@/data/pricing-data";
import { PricingToggle } from "@/components/pricing/PricingToggle";
import { MauSlider } from "@/components/pricing/MauSlider";
import { ProCard } from "@/components/pricing/ProCard";
import { FAQ } from "@/components/FAQ";
import { motion } from "framer-motion";

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = React.useState(true);
    const [sliderIndex, setSliderIndex] = React.useState(0);

    const currentTier = PRICING_CONFIG.tiers[sliderIndex];
    const displayPrice = isAnnual ? currentTier.annualPricePerMonth : currentTier.monthlyPrice;

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20 pt-[50px]">
            <main>
                {/* Hero Section */}
                <section className="relative pt-24 pb-16 overflow-hidden">
                    {/* Top Background Ornaments */}
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
                        <div
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#E65221] to-[#ff8c00] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                            style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}
                        />
                    </div>

                    <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-serif"
                        >
                            Simple, <span className="text-[#E65221]">scalable</span> pricing.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16"
                        >
                            Start for free, then scale as you grow. Only pay for what you use.
                        </motion.p>


                        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-16 items-start text-left">
                            {/* Left Column: Interactive Controls */}
                            <div className="space-y-12">
                                <div>
                                    <h3 className="text-2xl font-bold font-serif mb-4 text-[#E65221]">Select your volume</h3>
                                    <p className="text-muted-foreground mb-8">
                                        Choose the number of monthly active users (MAU) in your product.
                                    </p>
                                    <MauSlider
                                        tiers={PRICING_CONFIG.tiers}
                                        currentIndex={sliderIndex}
                                        onChange={setSliderIndex}
                                    />
                                </div>

                                <div className="bg-secondary/30 p-8 rounded-3xl border border-border/50">
                                    <h4 className="text-lg font-bold mb-4">FAQ - MAUs</h4>
                                    <div className="space-y-4 text-sm text-muted-foreground">
                                        <p><strong>What counts as an MAU?</strong> Any unique user who logs into your application during a billing period.</p>
                                        <p><strong>What if I exceed my limit?</strong> We won't block your tours. We'll simply reach out to help you upgrade to the next tier.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Pricing Card */}
                            <div className="relative">
                                <ProCard price={displayPrice} isAnnual={isAnnual} onToggle={setIsAnnual} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Existing FAQ component for general questions */}
                <section className="bg-secondary/20 py-24">
                    <FAQ />
                </section>

                {/* Bottom Contact CTA if they need enterprise */}
                <section className="py-24 text-center px-6">
                    <div className="max-w-4xl mx-auto bg-primary text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 relative z-10">Need more than 50k MAU?</h2>
                        <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto relative z-10">
                            We offer custom enterprise plans with white-labeling, SSO, and dedicated success managers.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-primary px-10 py-5 rounded-2xl font-bold text-lg shadow-lg relative z-10"
                        >
                            Contact Sales
                        </motion.button>
                    </div>
                </section>
            </main>
        </div>
    );
}
