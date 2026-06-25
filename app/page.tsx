import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            App
          </div>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex">
            <a className="transition hover:text-foreground" href="#">Overview</a>
            <a className="transition hover:text-foreground" href="#">Docs</a>
            <a className="transition hover:text-foreground" href="#">Pricing</a>
          </nav>
          <Button variant="ghost" className="h-9 px-4">Sign in</Button>
        </div>
      </header>

      <main className="container flex flex-1 flex-col justify-center py-20">
        <div className="animate-fade-up max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your app starts here
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            A clean Next.js + Tailwind shell with the design system already wired
            up — theme tokens, typography, Button and Card. Reshape this page into
            the real product: keep the parts you need and build the rest.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button>
              Get started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline">View components</Button>
          </div>
        </div>

        <Card className="animate-fade-up mt-12 max-w-2xl border-dashed bg-transparent">
          <p className="text-sm text-muted-foreground">
            Your interface goes here — a form, a table, a dashboard, a feed,
            whatever the product needs. Swap this placeholder for the real thing.
          </p>
        </Card>
      </main>
    </div>
  );
}
