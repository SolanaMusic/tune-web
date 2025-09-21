"use client";

import {
  BarChart3,
  CoinsIcon,
  MusicIcon,
  TrendingUpIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

export function Reports() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
        <CardDescription>Generate and download reports</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5" /> User Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Generate a detailed report of user activity, registrations, and
                engagement metrics.
              </p>
              <Button className="w-full">Generate Report</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MusicIcon className="h-5 w-5" /> Content Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Generate a report on music content, including plays, uploads,
                and popularity metrics.
              </p>
              <Button className="w-full">Generate Report</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CoinsIcon className="h-5 w-5" /> NFT Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Generate a report on NFT sales, minting activity, and
                marketplace performance.
              </p>
              <Button className="w-full">Generate Report</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5" /> Revenue Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Generate a financial report with revenue breakdowns,
                subscription data, and payment analytics.
              </p>
              <Button className="w-full">Generate Report</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" /> Artist Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Generate a report on artist performance, earnings, and content
                engagement metrics.
              </p>
              <Button className="w-full">Generate Report</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" /> Custom Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create a custom report by selecting specific metrics and data
                points to include.
              </p>
              <Button className="w-full">Create Custom Report</Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
