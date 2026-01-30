"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-white/10 pt-16 pb-8 bg-[#421d24] text-white/80 relative overflow-hidden">
            {/* Decorative background element for footer */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -mb-48 -mr-48 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                <div className="md:col-span-2 flex flex-col items-start gap-4">
                    <div className="flex items-center gap-1.5">
                        <img src="/logo.svg" alt="Product Tour Logo" className="w-8 h-8 opacity-90" />
                        <span className="font-serif font-bold text-xl text-white">Product Tour</span>
                    </div>
                    <p className="text-white/60 mt-2 max-w-sm leading-relaxed">
                        The easiest way to create interactive product walkthroughs.
                        Helping SaaS companies improve activation and reduce churn.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold mb-6 font-serif text-white">Product</h4>
                    <ul className="space-y-3 text-sm text-white/60">
                        <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                        <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                        <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-6 font-serif text-white">Legal</h4>
                    <ul className="space-y-3 text-sm text-white/60">
                        <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                        <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/impressum" className="hover:text-white transition-colors">Imprint</Link></li>
                    </ul>
                </div>
            </div>
            <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-white/40">
                © {new Date().getFullYear()} Product Tour. All rights reserved.
            </div>
        </footer>
    );
}
