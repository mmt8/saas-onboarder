"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, MousePointerClick, Sparkles, Zap, Lock, Globe, Rocket, Megaphone, HelpCircle, Layers, MessageSquare, CheckCircle2, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FeatureTabs } from "@/components/FeatureTabs";
import { SocialProofWall } from "@/components/SocialProofWall";
import { FAQ } from "@/components/FAQ";
import { HeroVisual } from "@/components/HeroVisual";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/20 bg-pattern-toast">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-12 md:pt-20 pb-20 overflow-hidden">
          <div className="vintage-vignette" />
          {/* Top Orange Gradient */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#E65221] to-[#ff8c00] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#E65221]/10 via-background to-background pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 font-serif max-w-4xl leading-[1.1] z-30 relative pt-12">
              AI product tours <span className="text-[#E65221]">driving adoption.</span>
            </h1>

            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 leading-relaxed font-medium z-30 relative">
              Auto-generate on-brand product tours with perfectly styled tooltips from your UI in seconds.
            </p>

            {/* Parallax Hero Visual */}
            <HeroVisual />

            <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 w-full justify-center z-40 relative md:-mt-24 mt-8">
              <Button size="lg" className="rounded-full px-12 h-16 text-xl shadow-2xl w-full sm:w-auto border-4 border-white/10" asChild>
                <Link href="/signup">
                  Create your first tour (free)
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Link>
              </Button>
            </div>

            {/* Social Proof Placeholder */}
            <div className="mt-24 py-12 border-t border-border/20 w-full max-w-2xl mx-auto opacity-80">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8">Trusted by product teams obsessed with activation.</p>
              <div className="flex justify-between items-center grayscale opacity-30 gap-8">
                <div className="h-6 w-24 bg-foreground/20 rounded" />
                <div className="h-6 w-24 bg-foreground/20 rounded" />
                <div className="h-6 w-24 bg-foreground/20 rounded" />
                <div className="h-6 w-24 bg-foreground/20 rounded" />
              </div>
            </div>
          </div>
        </section>



        {/* Feature Tabs Section */}
        <section className="bg-transparent">
          <FeatureTabs />
        </section>

        {/* New How It Works Section */}
        <section className="py-24 bg-transparent relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">How it works</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The fastest way to build on-brand product walkthroughs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="bg-white border border-border/50 p-8 rounded-[2.5rem] relative z-10 flex flex-col items-start text-left shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4 font-serif">Install with a single line of code</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Copy a lightweight snippet and add it to your site. No SDKs, no complex setup.
                </p>
              </div>

              <div className="bg-white border border-border/50 p-8 rounded-[2.5rem] relative z-10 flex flex-col items-start text-left shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4 font-serif">Match your product’s look & feel</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Choose a ready-made style or let AI automatically adapt tours to your existing UI and brand.
                </p>
              </div>

              <div className="bg-white border border-border/50 p-8 rounded-[2.5rem] relative z-10 flex flex-col items-start text-left shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-4 font-serif">Generate, refine, and publish tours</h3>
                <p className="text-muted-foreground leading-relaxed">
                  AI creates draft product tours for you. Review, edit if needed, and publish instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-24 bg-secondary/20 relative overflow-hidden border-y border-border/10">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">Use cases</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Deliver the right guidance at the right time throughout the entire customer lifecycle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "User Onboarding",
                  description: "Guide new users through the critical first steps of your product.",
                  icon: <Rocket className="w-6 h-6 text-primary" />,
                  delay: 0.1
                },
                {
                  title: "Feature adoption",
                  description: "Introduce new functionalities and ensure your users get the most value.",
                  icon: <Zap className="w-6 h-6 text-primary" />,
                  delay: 0.2
                },
                {
                  title: "Release announcements",
                  description: "Highlight important updates and changes directly within the app.",
                  icon: <Megaphone className="w-6 h-6 text-primary" />,
                  delay: 0.3
                },
                {
                  title: "Self-serve guidance",
                  description: "Empower users to find answers and solve problems autonomously.",
                  icon: <HelpCircle className="w-6 h-6 text-primary" />,
                  delay: 0.4
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: item.delay }}
                  whileHover={{ y: -5 }}
                  className="bg-white border border-border/50 p-8 rounded-[2rem] flex flex-col items-start text-left shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-serif">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Wall */}
        <div className="pt-24 pb-0 bg-transparent">
          <SocialProofWall />
        </div>



        {/* Coming Soon Section */}
        <section className="py-24 bg-black text-white overflow-hidden relative border-t border-white/10">
          {/* Lively Background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" />
          </div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
              <div>
                <Badge variant="outline" className="mb-4 text-white/60 border-white/20">Roadmap</Badge>
                <h2 className="text-4xl md:text-5xl font-bold font-serif">Shipping soon...</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ComingSoonCard
                icon={<Globe />}
                title="Multi-language Support"
                description="Automatically translate your tours into 30+ languages to capture global markets."
              />
              <ComingSoonCard
                icon={<Megaphone />}
                title="In app announcements"
                description="Pop-ups, banners to keep your users informed"
              />
              <ComingSoonCard
                icon={<CheckCircle2 />}
                title="Onboarding checklist"
                description="Turn complex onboarding into a step by step journey"
              />
              <ComingSoonCard
                icon={<MessageSquare />}
                title="Feedback"
                description="Gather direct insights from your users while they explore your product."
              />
              <ComingSoonCard
                icon={<BarChart3 />}
                title="Reporting"
                description="Advanced analytics to track tour performance and user engagement."
              />
              <ComingSoonCard
                icon={<Star />}
                title="NPS and surveys"
                description="Measure customer satisfaction and gather targeted qualitative feedback."
              />
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-32 text-center px-6 bg-white/40 border-y border-border/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern-toast opacity-20 pointer-events-none" />
          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold font-serif tracking-tight leading-tight">
              Your entire onboarding flow. <span className="text-[#E65221]">Done in seconds.</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Turn new signups into power users automatically. Just connect your web-app and let our AI build your product tour instantly.
            </p>
            <div className="flex justify-center pt-4">
              <Button size="lg" className="rounded-full px-12 h-16 text-xl shadow-2xl" asChild>
                <Link href="/signup">
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      {/* Footer */}
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
    </div>
  );
}


function ComingSoonCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-white">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white font-serif">{title}</h3>
      <p className="text-white/60 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
