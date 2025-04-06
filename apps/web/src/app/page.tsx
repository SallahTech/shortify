"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import * as auth from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");

  const handleDemoSubmit = () => {
    if (!url) return;

    if (!auth.isAuthenticated()) {
      router.push("/signup");
      return;
    }

    router.push(`/dashboard/links/new?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-32 md:py-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative z-10 mx-auto flex max-w-[800px] flex-col items-center space-y-8 text-center">
              <h1 className="animate-fade-up bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
                URL shortener with
                <span className="block mt-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  custom CTA overlays
                </span>
              </h1>
              <p className="mx-auto max-w-[600px] animate-fade-up text-lg text-muted-foreground/90 sm:text-xl [--animation-delay:200ms]">
                Add a call-to-action to any page you share.
              </p>

              <div className="mt-10 flex animate-fade-up flex-col items-center gap-4 sm:flex-row [--animation-delay:400ms]">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="h-12 w-full px-8 text-lg shadow-lg transition-transform hover:scale-105 sm:w-auto"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 w-full px-8 text-lg transition-transform hover:scale-105 sm:w-auto"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>

              {/* URL Input Demo */}
              <div className="relative mt-16 w-full max-w-2xl animate-fade-up [--animation-delay:600ms]">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/30 opacity-30 blur"></div>
                <div className="relative rounded-xl border bg-card/50 backdrop-blur-sm p-8 shadow-2xl">
                  <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <input
                      type="url"
                      placeholder="https://example.com/article"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex h-12 w-full rounded-lg border border-input/50 bg-background/50 px-4 py-2 text-base backdrop-blur-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <Button
                      size="lg"
                      onClick={handleDemoSubmit}
                      className="h-12 w-full px-8 text-base font-semibold shadow-lg transition-transform hover:scale-105 sm:w-auto"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute left-1/2 top-0 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"></div>
        </section>

        {/* Features Section */}
        <section className="relative border-t bg-background py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative z-10 mx-auto space-y-20">
              <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
                <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  Features
                </h2>
                <p className="max-w-[85%] text-lg text-muted-foreground">
                  Everything you need to boost engagement and drive traffic
                </p>
              </div>
              <div className="mx-auto grid max-w-[64rem] justify-center gap-8 sm:grid-cols-2 md:grid-cols-3">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="group relative overflow-hidden rounded-xl border bg-card p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50"
                  >
                    <div className="flex h-[200px] flex-col items-center justify-between rounded-lg p-6 text-center">
                      <feature.icon className="h-12 w-12 text-primary transition-transform duration-300 group-hover:scale-110" />
                      <div className="space-y-2">
                        <h3 className="font-bold text-xl text-foreground">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute right-0 bottom-0 -z-10 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute left-0 top-1/2 -z-10 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"></div>
        </section>
      </main>
    </div>
  );
}

const features = [
  {
    title: "Custom Branded Links",
    description: "Create short links that match your brand identity",
    icon: LinkIcon,
  },
  {
    title: "CTA Overlays",
    description: "Add custom call-to-action overlays to any shared page",
    icon: LayersIcon,
  },
  {
    title: "Analytics & Tracking",
    description: "Track clicks and engagement in real-time",
    icon: BarChartIcon,
  },
];

function LinkIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function LayersIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.91a1 1 0 0 0 0-1.83Z" />
      <path d="m22 13.29-9.17 4.17a2 2 0 0 1-1.66 0L2 13.29" />
      <path d="m22 17.29-9.17 4.17a2 2 0 0 1-1.66 0L2 17.29" />
    </svg>
  );
}

function BarChartIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}
