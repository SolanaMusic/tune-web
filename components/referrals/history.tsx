"use client";

import { formatDateTime, splitByCaps, statusStyles } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "../ui/table";
import { Star, Trophy, Users } from "lucide-react";
import { Badge } from "../ui/badge";

export function ReferralsHistory({ transactions }: { transactions: any[] }) {
  const getRewardIcon = (type: string) => {
    switch (type) {
      case "ReferralRegister":
        return <Users className="h-4 w-4" />;
      case "ReferralArtist":
        return <Star className="h-4 w-4" />;
      case "MilestoneRewards":
        return <Trophy className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral History</CardTitle>
        <CardDescription>
          Track all your referral rewards and earnings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRewardIcon(transaction.transactionType)}
                      <span className="capitalize">
                        {splitByCaps(transaction.transactionType)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {transaction.amount} {transaction.currency.symbol}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        statusStyles[transaction.status] ||
                        "bg-muted/20 text-muted-foreground"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {splitByCaps(transaction.paymentMethod)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateTime(transaction.createdDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
