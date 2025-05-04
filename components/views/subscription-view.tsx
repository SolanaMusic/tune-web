"use client";

import { useState } from "react";
import {
  Check,
  X,
  CreditCard,
  Music,
  Users,
  Headphones,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ViewType } from "@/components/music-app";

interface SubscriptionViewProps {
  onNavigate?: (view: ViewType, id?: string) => void;
}

export function SubscriptionView({ onNavigate }: SubscriptionViewProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [currency, setCurrency] = useState<"usd" | "sol" | "tune">("usd");

  const currencySymbols = {
    usd: "$",
    sol: "◎",
    tune: "♪",
  };

  const conversionRates = {
    usd: 1,
    sol: 0.05,
    tune: 10,
  };

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      description: "Essential music streaming",
      monthlyPrice: 4.99,
      yearlyPrice: 49.99,
      features: [
        "Ad-supported listening",
        "Mobile app access",
        "Standard audio quality",
      ],
      limitations: [
        "No offline listening",
        "Limited skips",
        "No family accounts",
      ],
      popular: false,
      cta: "Get Started",
    },
    {
      id: "premium",
      name: "Premium Plan",
      description: "Enhanced music experience",
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      features: [
        "Ad-free listening",
        "Unlimited skips",
        "High quality audio",
        "Offline listening",
      ],
      limitations: ["No family accounts"],
      popular: true,
      cta: "Get Premium",
    },
    {
      id: "family",
      name: "Family Plan",
      description: "Premium for up to 6 accounts",
      monthlyPrice: 14.99,
      yearlyPrice: 149.99,
      features: [
        "All Premium features",
        "Up to 6 accounts",
        "Parental controls",
        "Shared playlists",
      ],
      limitations: [],
      popular: false,
      cta: "Get Family Plan",
    },
  ];

  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyCostForYear = monthlyPrice * 12;
    const savings = monthlyCostForYear - yearlyPrice;
    const savingsPercentage = (savings / monthlyCostForYear) * 100;
    return Math.round(savingsPercentage);
  };

  const convertPrice = (price: number) => {
    return (price * conversionRates[currency]).toFixed(
      currency === "tune" ? 0 : 2
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock the full potential of Tune with a premium subscription. Choose
          the plan that fits your needs and start enjoying unlimited music
          today.
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <Tabs
          defaultValue="monthly"
          value={billingCycle}
          onValueChange={(value) =>
            setBillingCycle(value as "monthly" | "yearly")
          }
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly{" "}
              <Badge className="ml-2 bg-primary/20 text-primary">
                Save up to 17%
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mb-8 flex justify-center">
        <Select
          value={currency}
          onValueChange={(value) =>
            setCurrency(value as "usd" | "sol" | "tune")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usd">USD ($)</SelectItem>
            <SelectItem value="sol">SOL (◎)</SelectItem>
            <SelectItem value="tune">TUNE (♪)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col ${
              plan.popular ? "border-primary shadow-lg shadow-primary/10" : ""
            } relative overflow-hidden`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0">
                <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {plan.name === "Basic Plan" && (
                  <Music className="h-5 w-5 text-muted-foreground" />
                )}
                {plan.name === "Premium Plan" && (
                  <Headphones className="h-5 w-5 text-primary" />
                )}
                {plan.name === "Family Plan" && (
                  <Users className="h-5 w-5 text-primary" />
                )}
                {plan.name}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">
                    {currencySymbols[currency]}
                    {convertPrice(
                      billingCycle === "monthly"
                        ? plan.monthlyPrice
                        : plan.yearlyPrice
                    )}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
                {billingCycle === "yearly" && (
                  <div className="text-sm text-primary mt-1">
                    Save {calculateSavings(plan.monthlyPrice, plan.yearlyPrice)}
                    % with annual billing
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">What's included:</h3>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Limitations:</h3>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">
                            {limitation}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${
                  plan.popular
                    ? ""
                    : "bg-card hover:bg-accent text-foreground border"
                }`}
                variant={plan.popular ? "default" : "outline"}
                onClick={() => onNavigate && onNavigate("profile")}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 bg-card border rounded-lg p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
            <p className="text-muted-foreground mb-6">
              We accept various payment methods to make your subscription
              process seamless and secure.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-background rounded-md px-3 py-2 border">
                <CreditCard className="h-5 w-5" />
                <span>Credit Card</span>
              </div>
              <div className="flex items-center gap-2 bg-background rounded-md px-3 py-2 border">
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                </svg>
                <span>PayPal</span>
              </div>
              <div className="flex items-center gap-2 bg-background rounded-md px-3 py-2 border">
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                <span>Apple Pay</span>
              </div>
              <div className="flex items-center gap-2 bg-background rounded-md px-3 py-2 border">
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22V8" />
                  <path d="m5 12-2-2 2-2" />
                  <path d="m19 12 2-2-2-2" />
                  <path d="M5 10h14" />
                  <path d="m5 2 7 3 7-3" />
                </svg>
                <span>Crypto</span>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-background p-6 rounded-lg border">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Secure Transactions</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                All payments are processed securely. We use industry-standard
                encryption to protect your personal and financial information.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">256-bit SSL encryption</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">PCI DSS compliant</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Fraud protection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Cancel anytime</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
