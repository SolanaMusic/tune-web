"use client";

import {
  CheckCircle,
  Clock,
  Copy,
  DollarSign,
  Share2,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import axios from "axios";
import { useEffect, useState, Dispatch } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useUserStore } from "@/stores/UserStore";

export function ReferralsOverview({
  referrals,
  setReferrals,
}: {
  referrals: any;
  setReferrals: Dispatch<any>;
}) {
  const [milestones, setMilestones] = useState<any[]>([]);
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}referrals/milestones`
        );
        setMilestones(response.data || []);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const handleClaim = async (milestoneId: string) => {
    try {
      if (!user) return;

      const milestone = milestones.find((m) => m.id === milestoneId);
      if (!milestone) return;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}referrals/milestones`,
        { milestoneId, userId: user.id }
      );

      setReferrals((prev: any) => ({
        ...prev,
        milestoneRewards: [
          ...(prev.milestoneRewards || []),
          { milestoneRewardId: milestoneId },
        ],
        transactions: [response.data, ...(prev.transactions || [])],
      }));

      const rewardAmount = response.data?.amount || milestone.reward || 0;
      setUser({ ...user, tokensAmount: user.tokensAmount + rewardAmount });
    } catch (error) {
      console.error("Failed to claim reward:", error);
    }
  };

  const totalReferrals = referrals?.referrals?.length || 0;
  const totalEarnings =
    referrals?.transactions?.reduce(
      (sum: number, t: any) => sum + (t.amount || 0),
      0
    ) || 0;
  const currencySymbol = referrals?.transactions?.[0]?.currency?.symbol || "";

  const copyReferralCode = () => {
    if (!referrals?.profile?.referralCode) return;
    navigator.clipboard.writeText(referrals.profile.referralCode);
  };

  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth?ref=${referrals?.profile?.referralCode}`
      : "";

  const copyReferralLink = () => {
    if (referralLink) navigator.clipboard.writeText(referralLink);
  };

  const shareReferral = async () => {
    const shareData = {
      title: "Join Tune - Music NFT Platform",
      text: "Join me on Tune, the revolutionary music NFT platform! Use my referral code to get started.",
      url: referralLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      copyReferralLink();
    }
  };

  const nextMilestone = milestones.find(
    (m) => totalReferrals < m.referralsCount
  );

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Referrals
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              Total users referred
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalEarnings > 0 ? "text-green-600" : "text-gray-500"
              }`}
            >
              {totalEarnings.toFixed(2)} {currencySymbol}
            </div>
            <p className="text-xs text-muted-foreground">All-time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Next Milestone
            </CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {!nextMilestone ? (
              <div className="text-2xl font-bold">All achieved</div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {nextMilestone.referralsCount - totalReferrals} more
                </div>
                <p className="text-xs text-muted-foreground">
                  To earn <strong>{nextMilestone.reward} TUNE</strong>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" /> Your Referral Code
          </CardTitle>
          <CardDescription>
            Share this code with friends to earn rewards when they join
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="referral-code">Referral Code</Label>
              <div className="flex mt-1">
                <Input
                  id="referral-code"
                  value={referrals.profile.referralCode}
                  readOnly
                  className="font-mono text-lg"
                />
                <Button
                  variant="outline"
                  className="ml-2 bg-transparent"
                  onClick={copyReferralCode}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <Label htmlFor="referral-link">Referral Link</Label>
            <div className="flex mt-1">
              <Input
                id="referral-link"
                value={referralLink}
                readOnly
                className="text-sm"
              />
              <Button
                variant="outline"
                className="ml-2 bg-transparent"
                onClick={copyReferralLink}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex">
            <Button onClick={shareReferral} className="flex-1">
              <Share2 className="mr-2 h-4 w-4" /> Share Referral Link
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" /> Milestone Rewards
          </CardTitle>
          <CardDescription>
            Earn bonus rewards when you reach referral milestones
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!milestones?.length ? (
            <p className="text-sm text-muted-foreground">
              No milestones found.
            </p>
          ) : (
            <div className="space-y-3">
              {milestones.map((milestone, index) => {
                const isUnlocked = referrals.milestoneRewards?.some(
                  (mr: any) => mr.milestoneRewardId === milestone.id
                );

                const canClaim =
                  totalReferrals >= milestone.referralsCount && !isUnlocked;

                return (
                  <div
                    key={index}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border gap-3 sm:gap-0 ${
                      isUnlocked
                        ? "bg-green-500/10 border-green-500/20"
                        : canClaim
                        ? "bg-green-500/20 border-green-500/30"
                        : "bg-muted/50 border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          isUnlocked
                            ? "bg-green-500 text-white"
                            : canClaim
                            ? "bg-green-600 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isUnlocked ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Trophy className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {milestone.referralsCount} Referrals
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Milestone bonus: {milestone.reward} TUNE
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {isUnlocked ? (
                        <Badge
                          variant="outline"
                          className="bg-green-500/20 text-green-500"
                        >
                          Unlocked
                        </Badge>
                      ) : canClaim ? (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleClaim(milestone.id)}
                        >
                          Claim
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {milestone.referralsCount - totalReferrals} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
