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
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-20 overflow-hidden">
          {/* Top Orange Gradient */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#E65221] to-[#ff8c00] opacity-50 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#E65221]/20 via-background to-background pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">

            <Badge variant="secondary" className="mb-8 py-1.5 px-4 rounded-full border border-primary/20 bg-primary/5 text-primary animate-in fade-in zoom-in duration-500">
              <Sparkles className="w-3.5 h-3.5 mr-2 fill-primary" />
              <span>Free in Beta</span>
            </Badge>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 font-serif max-w-4xl leading-[1.1] z-30 relative">
              Onboard users <br />
              <span className="text-[#E65221]">at warp speed.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 leading-relaxed font-medium z-30 relative">
              Cure writer's block forever. Autogenerate interactive product tours in seconds and skyrocket your activation rates.
            </p>

            {/* Parallax Hero Visual */}
            <HeroVisual />

            <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 w-full justify-center z-40 relative -mt-24">
              <Button size="lg" className="rounded-full px-12 h-16 text-xl shadow-2xl hover:scale-105 transition-all bg-primary hover:bg-primary/90 w-full sm:w-auto border-4 border-white/10" asChild>
                <Link href="/signup">
                  Get Started for Free
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-12 h-16 text-xl hover:bg-white/10 border-2 w-full sm:w-auto backdrop-blur-md bg-white/5 border-white/20" asChild>
                <Link href="/demo">Interactive Demo</Link>
              </Button>
            </div>

            {/* Social Proof Placeholder */}
            <div className="mt-24 py-12 border-t border-border/20 w-full max-w-2xl mx-auto opacity-80">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8">Trusted by innovative product teams</p>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">Everything you need to activate.</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful tools designed to make your product adoption curve vertical.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[600px]">

              {/* Large Card: Autogeneration */}
              <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-[2.5rem] bg-secondary border border-border/50 p-10 hover:shadow-2xl transition-all duration-500">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                    <Zap className="w-7 h-7" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 font-serif">Autogenerate & Edit</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                    Staring at a blank page is painful. Let our engine generate the initial tour for you based on your UI.
                    Simply tweak, polish, and publish. It's like having a growth hacker in your pocket.
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

              {/* Smaller Card: No Code */}
              <div className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-border/50 p-8 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center mb-4">
                  <MousePointerClick className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-serif">No-Code Visual Editor</h3>
                <p className="text-muted-foreground">
                  Point and click to attach steps to any element. CSS selectors are handled automatically.
                </p>
              </div>

              {/* Smaller Card: Analytics */}
              <div className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-border/50 p-8 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 text-blue-500">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-serif">Deep Analytics</h3>
                <p className="text-muted-foreground">
                  Identify exactly where users drop off. Optimize your funnel with data-backed decisions.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Feature Tabs Section */}
        <section className="bg-background">
          <FeatureTabs />
        </section>

        {/* Social Proof Wall */}
        <SocialProofWall />

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
                icon={<Sparkles />}
                title="AI Voice Over"
                description="Turn text steps into human-like audio instructions automatically."
              />
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-32 text-center px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-5xl font-bold font-serif tracking-tight">Ready to activate your users?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of product managers building better onboarding experiences.
            </p>
            <div className="flex justify-center pt-4">
              <Button size="lg" className="rounded-full px-12 h-16 text-xl shadow-2xl hover:scale-105 transition-transform" asChild>
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
