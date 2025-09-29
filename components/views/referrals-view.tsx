"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { ReferralsRewards } from "../referrals/rewards";
import { ReferralsHistory } from "../referrals/history";
import { useUserStore } from "@/stores/UserStore";
import axios from "axios";
import { ReferralsOverview } from "../referrals/overview";

export function ReferralsView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [referrals, setReferrals] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        var response = axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}referrals/${user.id}`
        );
        setReferrals((await response).data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="translate-y-[-70px]">
          <Loader2 className="h-20 w-20 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Referral Program</h1>
        <p className="text-muted-foreground">
          Earn rewards by inviting friends to join Tune
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rewards">Reward Types</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ReferralsOverview
            referrals={referrals}
            setReferrals={setReferrals}
          />
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <ReferralsRewards />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <ReferralsHistory transactions={referrals.transactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
