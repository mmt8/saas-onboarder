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
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">

            <Badge variant="secondary" className="mb-8 py-1.5 px-4 rounded-full border border-primary/20 bg-primary/5 text-primary animate-in fade-in zoom-in duration-500">
              <Sparkles className="w-3.5 h-3.5 mr-2 fill-primary" />
              <span>Free in Beta</span>
            </Badge>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 font-serif max-w-4xl leading-[1.1] z-30 relative">
              Onboard users <br />
              <span className="text-primary">at warp speed.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 leading-relaxed font-medium z-30 relative">
              Cure writer's block forever. Autogenerate interactive product tours in seconds and skyrocket your activation rates.
            </p>

            {/* Parallax Hero Visual */}
            <HeroVisual />

            <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 w-full justify-center z-40 relative -mt-32">
              <Button size="lg" className="rounded-full px-10 h-16 text-lg shadow-2xl hover:scale-105 transition-all bg-primary hover:bg-primary/90 w-full sm:w-auto border-4 border-white/10" asChild>
                <Link href="/signup">
                  Start Building for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg hover:bg-white/10 border-2 w-full sm:w-auto backdrop-blur-md bg-white/5" asChild>
                <Link href="/demo">View Interactive Demo</Link>
              </Button>
            </div>

            {/* Social Proof Placeholder */}
            <div className="mt-20 pt-10 border-t border-border/40 w-full max-w-xl mx-auto opacity-70">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">Trusted by innovative product teams</p>
              <div className="flex justify-between items-center grayscale opacity-50">
                <div className="h-8 w-24 bg-foreground/20 rounded animate-pulse" />
                <div className="h-8 w-24 bg-foreground/20 rounded animate-pulse" />
                <div className="h-8 w-24 bg-foreground/20 rounded animate-pulse" />
                <div className="h-8 w-24 bg-foreground/20 rounded animate-pulse" />
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
        <section className="py-24 bg-[#1C1C1E] text-white overflow-hidden relative border-t border-white/5">
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
      <footer className="border-t border-border/40 py-12 bg-background">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 flex flex-col items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-foreground/5 rounded-lg">
                <img src="/logo.svg" alt="Product Tour Logo" className="w-5 h-5 opacity-80" />
              </div>
              <span className="font-serif font-bold text-xl">Product Tour</span>
            </div>
            <p className="text-muted-foreground mt-2 max-w-sm leading-relaxed">
              The easiest way to create interactive product walkthroughs.
              Helping SaaS companies improve activation and reduce churn.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 font-serif">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/login" className="hover:text-foreground transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 font-serif">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/impressum" className="hover:text-foreground transition-colors">Imprint</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
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
