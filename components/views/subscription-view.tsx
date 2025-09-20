"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Check, X, Music, Users, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSolana } from "@/hooks/use-solana";
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
import axios from "axios";
import PaymentMethods from "../ui/payment-methods";

interface SubscriptionPlan {
  id: number;
  name: string;
  durationInMonths: number;
  type: string;
  maxMembers: number;
  tokensMultiplier: number;
  subscriptionPlanCurrencies: {
    id: number;
    price: number;
    currency: {
      id: number;
      code: string;
      symbol: string;
    };
  }[];
}

export function SubscriptionView() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [currencies, setCurrencies] = useState<
    { id: number; code: string; symbol: string }[]
  >([]);

  const [currency, setCurrency] = useState<string>("USD");
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [solPrice, setSolPrice] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();
  const { sendSolanaTransaction } = useSolana();

  const fetchPlans = async () => {
    try {
      const response = await axios.get<SubscriptionPlan[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}subscription-plans`
      );
      setPlans(response.data);
    } catch (error) {
      console.error("Failed to fetch subscription plans", error);
    }
  };

  const connectToBinanceSocket = () => {
    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_BINANCE_WS_URL}/solusdt@trade`
    );

    let latestPrice = 0;
    let intervalId: NodeJS.Timeout;
    let isFirstUpdate = true;

    socket.onopen = () => {
      intervalId = setInterval(() => {
        if (latestPrice > 0) {
          setSolPrice(latestPrice);
        }
      }, 10_000);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      latestPrice = parseFloat(message.p);

      if (isFirstUpdate) {
        setSolPrice(latestPrice);
        isFirstUpdate = false;
      }
    };

    socket.onclose = () => {
      clearInterval(intervalId);
      setTimeout(connectToBinanceSocket, 5000);
    };

    socket.onerror = () => {
      clearInterval(intervalId);
      socket.close();
    };
  };

  const handlePayment = async (
    planId: number,
    planPriceUSD: number,
    currencyId: number
  ) => {
    const finalPrice =
      billingCycle === "yearly" ? planPriceUSD * 12 * 0.83 : planPriceUSD;

    if (currencyId === 1) {
      await handleBankTransfer(planId, currencyId);
    } else if (currencyId === 2) {
      await handleCryptoPayment(planId, finalPrice, currencyId);
    }
  };

  const handleBankTransfer = async (planId: number, currencyId: number) => {
    const paymentData = {
      userId: 1,
      currencyId: currencyId,
      stripeSubscriptionPaymentDto: {
        subscriptionPlanId: planId,
        imageUrl: `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}images/favicon.jpg`,
        successUrl: `${window.location.origin}/profile`,
        cancelUrl: `${window.location.origin}${pathname}`,
      },
    };

    try {
      var response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}payments/stripe`,
        paymentData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        router.push(response.data);
      }
    } catch (error) {
      console.error("Error posting Stripe payment:", error);
    }
  };

  const handleCryptoPayment = async (
    planId: number,
    planPriceUSD: number,
    currencyId: number
  ) => {
    try {
      const lamports = Math.round((planPriceUSD / solPrice) * 1_000_000_000);
      const signature = await sendSolanaTransaction(
        process.env.NEXT_PUBLIC_SYSTEM_WALLET_ADRESS!,
        lamports
      );

      var response = await recordPayment(
        planId,
        currencyId,
        lamports / 1_000_000_000,
        signature,
        "completed"
      );

      if (response?.status === 200) {
        router.push("/profile");
      }
    } catch (error) {
      console.error("Error during Solana payment:", error);
      await recordPayment(planId, currencyId, 0, null, "failed");
    }
  };

  const recordPayment = async (
    planId: number,
    currencyId: number,
    amount: number,
    paymentIntent: string | null,
    status: "pending" | "completed" | "failed"
  ) => {
    const paymentRequest = {
      userId: 1,
      currencyId,
      amount,
      subscriptionPlanId: planId,
      paymentIntent,
      status,
    };

    try {
      return await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}payments/crypto`,
        paymentRequest,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error posting payment record:", error);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}currencies`
      );
      setCurrencies(response.data);
    } catch (error) {
      console.error("Failed to fetch currencies", error);
    }
  };

  useEffect(() => {
    fetchPlans();
    connectToBinanceSocket();
    fetchCurrencies();
  }, []);

  const currencySymbols = {
    USD: "$",
    SOL: "◎",
    TUNE: "♪",
  };

  const freePlan = {
    id: 0,
    name: "Free Plan",
    durationInMonths: 0,
    type: "Individual",
    maxMembers: 1,
    tokensMultiplier: 0,
    subscriptionPlanCurrencies: [
      {
        id: 0,
        price: 0,
        currency: {
          id: 0,
          code: "USD",
          symbol: "$",
        },
      },
    ],
    description: "Enjoy music with limited features for free",
    features: ["Ad-supported listening", "Basic audio quality"],
    limitations: [
      "Limited skips",
      "No offline listening",
      "No family accounts",
    ],
    popular: false,
    cta: "Sign Up for Free",
  };

  const extendedPlans = [
    freePlan,
    ...plans.map((plan) => ({
      ...plan,
      description:
        plan.name === "Basic Plan"
          ? "Essential music streaming"
          : plan.name === "Premium Plan"
          ? "Enhanced music experience"
          : "Premium for up to 6 accounts",
      features:
        plan.name === "Basic Plan"
          ? [
              "Ad-supported listening",
              "Mobile app access",
              "Standard audio quality",
            ]
          : plan.name === "Premium Plan"
          ? [
              "Ad-free listening",
              "Unlimited skips",
              "High quality audio",
              "Offline listening",
            ]
          : [
              "All Premium features",
              "Up to 6 accounts",
              "Parental controls",
              "Shared playlists",
            ],
      limitations:
        plan.name === "Basic Plan"
          ? ["No offline listening", "No family accounts"]
          : plan.name === "Premium Plan"
          ? ["No family accounts"]
          : [],
      popular: plan.name === "Premium Plan",
      cta:
        plan.name === "Basic Plan"
          ? "Get Started"
          : plan.name === "Premium Plan"
          ? "Get Premium"
          : "Get Family Plan",
    })),
  ];

  const convertPrice = (price: number) => {
    if (currency === "SOL") {
      return solPrice ? (price / solPrice).toFixed(6) : "—";
    }
    return price.toFixed(
      currencies.find((c) => c.code === currency)?.code === "TUNE" ? 0 : 2
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

      <div className="mb-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
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
              Yearly
              <Badge className="ml-2 bg-primary/20 text-primary">
                Save up to 17%
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Select
          value={currency}
          onValueChange={(value) => setCurrency(value as any)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((cur) => (
              <SelectItem key={cur.code} value={cur.code}>
                {cur.code} ({cur.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {extendedPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col ${
              plan.popular ? "border-primary shadow-lg shadow-primary/10" : ""
            } relative overflow-hidden`}
          >
            {plan.popular && (
              <Badge className="absolute top-0 right-0 rounded-none rounded-bl-lg bg-primary text-primary-foreground">
                Most Popular
              </Badge>
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
                    {plan.id === 0
                      ? "Free"
                      : `${currencySymbols[currency]}${convertPrice(
                          currency === "SOL"
                            ? billingCycle === "monthly"
                              ? plan.subscriptionPlanCurrencies.find(
                                  (c) => c.currency.code === "USD"
                                )?.price || 0
                              : (plan.subscriptionPlanCurrencies.find(
                                  (c) => c.currency.code === "USD"
                                )?.price || 0) *
                                12 *
                                0.83
                            : billingCycle === "monthly"
                            ? plan.subscriptionPlanCurrencies.find(
                                (c) => c.currency.code === currency
                              )?.price || 0
                            : (plan.subscriptionPlanCurrencies.find(
                                (c) => c.currency.code === currency
                              )?.price || 0) *
                              12 *
                              0.83
                        )}`}
                  </span>
                  {plan.id !== 0 && (
                    <span className="text-muted-foreground ml-1">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                  )}
                </div>
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
            {plan.id !== 0 && (
              <CardFooter className="space-y-4">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? ""
                      : "bg-card hover:bg-accent text-foreground border"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => {
                    handlePayment(
                      plan.id,
                      plan.subscriptionPlanCurrencies.find(
                        (c) => c.currency.code === "USD"
                      )?.price || 1,
                      plan.subscriptionPlanCurrencies.find(
                        (c) => c.currency.code === currency
                      )?.currency.id || 2
                    );
                  }}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      <PaymentMethods />
    </div>
  );
}
