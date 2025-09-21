"use client";

import {
  BarChart3Icon,
  MusicIcon,
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

export function Overview() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Songs</CardTitle>
            <MusicIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,432</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
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
              data={[
                { name: "Jan", total: 1200 },
                { name: "Feb", total: 1900 },
                { name: "Mar", total: 1800 },
                { name: "Apr", total: 2400 },
                { name: "May", total: 2700 },
                { name: "Jun", total: 3100 },
                { name: "Jul", total: 3500 },
                { name: "Aug", total: 3200 },
                { name: "Sep", total: 3800 },
                { name: "Oct", total: 4200 },
                { name: "Nov", total: 4600 },
                { name: "Dec", total: 5100 },
              ]}
              index="name"
              categories={["total"]}
              colors={["#2563eb"]}
              valueFormatter={(value) => `$${value}`}
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
              data={[
                { name: "Basic", value: 35 },
                { name: "Premium", value: 45 },
                { name: "Family", value: 20 },
              ]}
              index="name"
              categories={["value"]}
              colors={["#2563eb", "#4ade80", "#f97316"]}
              valueFormatter={(value) => `${value}%`}
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
              data={[
                { name: "Jan", total: 580 },
                { name: "Feb", total: 690 },
                { name: "Mar", total: 1100 },
                { name: "Apr", total: 1200 },
                { name: "May", total: 1380 },
                { name: "Jun", total: 1450 },
                { name: "Jul", total: 1700 },
                { name: "Aug", total: 1520 },
                { name: "Sep", total: 1900 },
                { name: "Oct", total: 2300 },
                { name: "Nov", total: 2400 },
                { name: "Dec", total: 2550 },
              ]}
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
              data={[
                { name: "Jan", total: 12000 },
                { name: "Feb", total: 18000 },
                { name: "Mar", total: 15000 },
                { name: "Apr", total: 22000 },
                { name: "May", total: 28000 },
                { name: "Jun", total: 32000 },
                { name: "Jul", total: 36000 },
                { name: "Aug", total: 30000 },
                { name: "Sep", total: 38000 },
                { name: "Oct", total: 42000 },
                { name: "Nov", total: 48000 },
                { name: "Dec", total: 52000 },
              ]}
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
