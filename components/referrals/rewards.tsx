"use client";

import { Star, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function ReferralsRewards() {
  const rewardTypes = [
    {
      type: "registration",
      title: "User Registration",
      reward: "100 TUNE",
      description: "Earn when someone signs up using your referral code",
      icon: Users,
    },
    {
      type: "artist_application",
      title: "Artist Application",
      reward: "500 TUNE",
      description:
        "Earn when your referred user's artist application gets approved",
      icon: Star,
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Reward Types</CardTitle>
          <CardDescription>
            Earn different rewards based on your referrals' actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {rewardTypes.map((reward, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-purple-500">
                      <reward.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{reward.title}</h3>
                      <p className="text-2xl font-bold text-primary mt-1">
                        {reward.reward}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {reward.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Simple steps to start earning referral rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Share Your Code</h3>
              <p className="text-sm text-muted-foreground">
                Share your unique referral code or link with friends and family
              </p>
            </div>
            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Friends Join</h3>
              <p className="text-sm text-muted-foreground">
                Your friends sign up using your referral code and start using
                Tune
              </p>
            </div>
            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Get rewarded when your referrals take different actions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
