"use client";

import {
  BadgeDollarSignIcon,
  BarChart3Icon,
  Loader2,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { BarChart, LineChart, PieChart } from "../ui/chart";
import { useEffect, useState } from "react";
import axios from "axios";

function PercentageChange({
  totalValue,
  currentValue,
  prevValue,
}: {
  totalValue: number;
  currentValue?: number;
  prevValue?: number;
}) {
  let textClass = "text-muted-foreground";
  let displayValue = `${totalValue}%`;

  if (totalValue > 0) {
    textClass = "text-green-600";
    displayValue = `+${totalValue}%`;
  } else if (totalValue < 0) {
    textClass = "text-red-600";
  }

  const changeInfo =
    currentValue !== undefined && prevValue !== undefined
      ? ` (${prevValue} → ${currentValue})`
      : "";

  return (
    <p className={`text-xs font-medium ${textClass}`}>
      {displayValue}
      {changeInfo}
    </p>
  );
}

export function Overview() {
  const [isLoading, setIsLoading] = useState(true);
  const [overview, setOverview] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}dashboard/overview`
        );

        setOverview(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching dashboard overview", error);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-20 w-20 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUpIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${overview.revenue.change.totalValue}
            </div>
            <PercentageChange
              totalValue={overview.revenue.change.percentageChange}
              currentValue={overview.revenue.change.currentValue}
              prevValue={overview.revenue.change.previousValue}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Users Dynamics
            </CardTitle>
            <UsersIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.activeUsers.change.totalValue}
            </div>
            <p className="text-xs text-muted-foreground">
              <PercentageChange
                totalValue={overview.activeUsers.change.percentageChange}
                currentValue={overview.activeUsers.change.currentValue}
                prevValue={overview.activeUsers.change.previousValue}
              />
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NFT Sales</CardTitle>
            <BadgeDollarSignIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.nftSales.change.totalValue}
            </div>
            <PercentageChange
              totalValue={overview.nftSales.change.percentageChange}
              currentValue={overview.nftSales.change.currentValue}
              prevValue={overview.nftSales.change.previousValue}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Subscriptions Sales
            </CardTitle>
            <BarChart3Icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.subscriptionStats.change.totalValue}
            </div>
            <PercentageChange
              totalValue={overview.subscriptionStats.change.percentageChange}
              currentValue={overview.subscriptionStats.change.currentValue}
              prevValue={overview.subscriptionStats.change.previousValue}
            />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <LineChart
              data={overview.revenue.monthly.map(
                (item: { date: string; value: number }) => ({
                  name: new Date(item.date).toLocaleString("en-US", {
                    month: "short",
                    year: "numeric",
                  }),
                  total: item.value,
                })
              )}
              index="name"
              categories={["total"]}
              colors={["#2563eb"]}
              valueFormatter={(value) => `$${value.toFixed(2)}`}
              className="h-60 w-full"
            />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>Breakdown of subscription plans</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart
              data={overview.subscriptionStats.stats.map(
                (item: { subscriptionType: string; count: number }) => ({
                  name: item.subscriptionType,
                  total: item.count,
                })
              )}
              index="name"
              categories={["total"]}
              colors={["#2563eb", "#4ade80", "#f97316"]}
              valueFormatter={(value) => `${value}`}
              className="h-60 w-full"
            />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <BarChart
              data={overview.activeUsers.monthly.map(
                (item: { date: string; value: number }) => ({
                  name: new Date(item.date).toLocaleString("en-US", {
                    month: "short",
                    year: "numeric",
                  }),
                  total: item.value,
                })
              )}
              index="name"
              categories={["total"]}
              colors={["#8b5cf6"]}
              valueFormatter={(value) => `${value}`}
              className="h-60 w-full"
            />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>NFT Sales</CardTitle>
            <CardDescription>Monthly NFT sales volume</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <LineChart
              data={overview.nftSales.monthly.map(
                (item: { date: string; value: number }) => ({
                  name: new Date(item.date).toLocaleString("en-US", {
                    month: "short",
                    year: "numeric",
                  }),
                  total: item.value,
                })
              )}
              index="name"
              categories={["total"]}
              colors={["#ec4899"]}
              valueFormatter={(value) => `$${value}`}
              className="h-60 w-full"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
