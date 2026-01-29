import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, MousePointerClick, Sparkles, Zap, Lock, Globe } from "lucide-react";
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
              AI product tours<br />
              <span className="text-[#E65221]">that drive adoption.</span>
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

        {/* Bento Grid Features */}
        <section className="py-24" id="features">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">AI-Powered <span className="text-[#E65221]">Precision</span> for every interaction.</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Autonomous discovery meets manual polish. Samantha scans your UI to build the perfect draft, while you maintain absolute control.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[600px]">

              {/* Large Card: AI Draft */}
              <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-[2.5rem] bg-secondary border border-border/50 p-10 hover:shadow-2xl transition-all duration-500">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                    <Zap className="w-7 h-7" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 font-serif">Pixel Perfect</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                    Every step is visually verified. Pick elements with surgical precision and customize every pixel of the guide.
                  </p>

                  {/* Visual Placeholder for Editor UI */}
                  <div className="mt-auto translate-y-12 translate-x-12 relative">
                    <div className="bg-background border border-border shadow-2xl rounded-tl-2xl p-6 w-full h-64 opacity-90 group-hover:scale-[1.02] transition-transform duration-500">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-muted/20 rounded w-3/4" />
                        <div className="h-4 bg-muted/20 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Card: No Code */}
              <div className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-border/50 p-8 hover:shadow-xl transition-all duration-300 md:row-span-2 flex flex-col h-full">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <MousePointerClick className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-serif">No-Code Visual Editor</h3>
                <p className="text-muted-foreground mb-8">
                  Point and click to attach steps to any element. CSS selectors are handled automatically.
                </p>
                <div className="mt-auto -mx-8 -mb-8 overflow-hidden rounded-b-[2.5rem]">
                  <img
                    src="/landing/no-code-editor.png"
                    alt="No-Code Visual Editor"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Feature Tabs Section */}
        <section className="bg-transparent">
          <FeatureTabs />
        </section>

        {/* Use Cases Section */}
        <section className="py-20 border-y border-border/10 bg-secondary/30 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-md">
                <h2 className="text-3xl font-bold font-serif mb-4">Contextual Relevance.</h2>
                <p className="text-muted-foreground text-lg">
                  Deliver the right guidance at the right time throughout the entire customer lifecycle.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                {["Onboarding", "Feature adoption", "Release announcements", "Self-serve guidance"].map((useCase) => (
                  <Badge key={useCase} variant="secondary" className="py-2 px-6 rounded-full text-base border border-primary/10 bg-background shadow-sm">
                    {useCase}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Wall */}
        <div className="py-24 bg-transparent">
          <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-serif">Enabling SaaS teams crush churn.</h2>
          </div>
          <SocialProofWall />
        </div>

        {/* How It Works Section */}
        <section className="py-32 bg-transparent relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">Clarity in 3 simple steps.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 -z-10" />

              <Step
                number="1"
                title="Record steps"
                description="Use our precise point-and-click recorder to capture every interaction in your product walkthrough."
              />
              <Step
                number="2"
                title="Edit visually"
                description="Use our intuitive no-code editor to tweak the copy, style, and flow. Brand it to match your product perfectly."
              />
              <Step
                number="3"
                title="Publish + measure"
                description="Deploy with a single line of code. Track activation rates and identify exactly where users need more help."
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />

        {/* Coming Soon Section */}
        {/* Coming Soon Section */}
        {/* Coming Soon Section */}
        <section className="py-24 bg-[#582400] text-white overflow-hidden relative border-t border-white/10">
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
                <h2 className="text-4xl md:text-5xl font-bold font-serif">Shipping soon.</h2>
              </div>
              <p className="text-white/60 max-w-md text-lg text-right md:text-left">
                We are building features to make your product adoption even faster.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ComingSoonCard
                icon={<Globe />}
                title="Multi-language Support"
                description="Automatically translate your tours into 30+ languages to capture global markets."
              />
              <ComingSoonCard
                icon={<Lock />}
                title="Advanced Team Permissions"
                description="Granular control over who can create, edit, and publish tours."
              />
              <ComingSoonCard
                icon={<Zap />}
                title="Performance Analytics"
                description="Detailed insights into exactly where users drop off in your tours."
              />
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-32 text-center px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold font-serif tracking-tight leading-tight">
              Stop fighting with tooltip code. <br />
              <span className="text-[#E65221]">Build guides in minutes.</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Empower your users, reduce support tickets, and crush churn with interactive guides.
            </p>
            <div className="flex justify-center pt-4">
              <Button size="lg" className="rounded-full px-12 h-16 text-xl shadow-2xl" asChild>
                <Link href="/signup">
                  Get Started for Free
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      {/* Footer */}
      {/* Footer */}
      <footer className="border-t border-white/10 py-16 bg-[#582400] text-white/80 relative overflow-hidden">
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

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="bg-background border border-border/50 p-8 rounded-[2.5rem] relative z-10 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-primary/20">
        {number}
      </div>
      <h3 className="text-2xl font-bold mb-4 font-serif">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
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
