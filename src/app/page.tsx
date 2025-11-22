import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap, BarChart3, MousePointerClick, Mic } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              New: Voice-Assisted Tour Creation
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 font-serif">
              Onboard users <br />
              <span className="text-primary">in minutes, not days.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Create interactive product tours, checklists, and tooltips without writing code.
              Boost adoption and reduce churn with intelligent guidance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform" asChild>
                <Link href="/dashboard">
                  Start Building for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg hover:bg-secondary/50" asChild>
                <Link href="/demo">View Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to activate users</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Powerful tools designed for product managers and customer success teams.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Mic className="w-6 h-6 text-primary" />}
                title="Voice-to-Tour"
                description="Simply speak to create tours. Our AI converts your voice instructions into interactive steps automatically."
              />
              <FeatureCard
                icon={<MousePointerClick className="w-6 h-6 text-accent" />}
                title="No-Code Editor"
                description="Point and click to select elements. Customize styles and content with a visual editor."
              />
              <FeatureCard
                icon={<BarChart3 className="w-6 h-6 text-blue-500" />}
                title="Analytics & Insights"
                description="Track tour completion rates and identify drop-off points to optimize your onboarding flow."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <span className="font-bold text-lg">SaaS Onboarder</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 SaaS Onboarder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-border/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
