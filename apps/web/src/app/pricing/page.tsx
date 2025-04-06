"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import * as auth from "@/lib/auth";

const plans = [
  {
    name: "Free",
    price: 0,
    features: [
      "Up to 50 links per month",
      "Basic analytics",
      "Standard CTA overlays",
      "Community support",
    ],
    limitations: [
      "No custom domains",
      "Limited analytics retention",
      "Basic CTA customization",
    ],
  },
  {
    name: "Pro",
    price: 9.99,
    features: [
      "Unlimited links",
      "Advanced analytics",
      "Custom CTA overlays",
      "Priority support",
      "Custom domains",
      "1 year analytics retention",
      "Advanced CTA customization",
      "Team collaboration",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 49.99,
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Unlimited analytics retention",
      "Advanced security features",
      "User roles & permissions",
      "Custom branding",
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const handleSubscribe = (planName: string) => {
    if (!auth.isAuthenticated()) {
      router.push("/login");
      return;
    }
    // TODO: Implement subscription logic
    console.log(`Subscribe to ${planName}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-6">Simple, transparent pricing</h1>
        <p className="text-xl text-muted-foreground">
          Choose the plan that best fits your needs. All plans include a 14-day
          free trial.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center bg-gray-200 rounded-lg p-1">
          <button
            className={`px-6 py-2 rounded-md transition-all duration-200 ${
              billingPeriod === "monthly"
                ? "bg-white shadow-md text-gray-900"
                : "text-gray-700 hover:text-gray-900"
            }`}
            onClick={() => setBillingPeriod("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-6 py-2 rounded-md transition-all duration-200 ${
              billingPeriod === "yearly"
                ? "bg-white shadow-md text-gray-900"
                : "text-gray-700 hover:text-gray-900"
            }`}
            onClick={() => setBillingPeriod("yearly")}
          >
            Yearly
            <span className="ml-1 text-sm font-medium text-green-700">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl w-full mx-auto px-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-xl border bg-card p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              plan.popular
                ? "border-primary shadow-lg scale-105 md:scale-110"
                : "hover:border-primary/50"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
                  Most Popular
                </span>
              </div>
            )}
            <div className="mb-8">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-bold">
                  $
                  {billingPeriod === "yearly"
                    ? (plan.price * 0.8).toFixed(2)
                    : plan.price}
                </span>
                <span className="ml-2 text-muted-foreground">/month</span>
              </div>
            </div>
            <ul className="mb-8 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-green-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
              {plan.limitations?.map((limitation) => (
                <li
                  key={limitation}
                  className="flex items-center text-muted-foreground"
                >
                  <svg
                    className="w-5 h-5 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>
            <Button
              className={`w-full py-6 text-lg transition-all duration-200 ${
                plan.popular
                  ? "bg-primary hover:bg-primary/90"
                  : "hover:bg-primary hover:text-primary-foreground"
              }`}
              variant={plan.popular ? "default" : "outline"}
              onClick={() => handleSubscribe(plan.name)}
            >
              {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-muted-foreground">
          Have questions?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact our team
          </Link>
        </p>
      </div>
    </div>
  );
}
