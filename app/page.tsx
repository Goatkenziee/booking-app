import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
      <section className="container relative flex flex-col items-center pt-28 text-center">
        <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" /> Built on YouMe
        </span>
        <h1 className="animate-fade-up mt-6 max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
          Your <span className="gradient-text">beautiful</span> app starts here
        </h1>
        <p className="animate-fade-up mt-5 max-w-xl text-lg text-muted-foreground">
          A clean, production-ready base — type what you want and watch it build.
        </p>
        <div className="animate-fade-up mt-8 flex gap-3">
          <Button>Get started</Button>
          <Button variant="ghost">Learn more</Button>
        </div>
      </section>

      <section className="container relative mt-24 grid gap-5 pb-28 sm:grid-cols-3">
        {[
          { icon: Zap, title: "Fast", body: "Modern Next.js + Tailwind, tuned for speed." },
          { icon: Shield, title: "Solid", body: "A real design system, accessible by default." },
          { icon: Sparkles, title: "Yours", body: "Edit anything — the agent builds on this base." },
        ].map((f) => (
          <Card key={f.title} className="animate-fade-up">
            <f.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}
