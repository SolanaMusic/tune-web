"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  CreditCard,
  Edit,
  LogOut,
  User,
  Settings,
  Calendar,
  Clock,
  Wallet,
  ListMusic,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export function ProfileView() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  const userProfile = {
    name: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    avatar: "",
    following: 118,
    bio: "Music enthusiast and playlist curator. Always on the lookout for new sounds and artists.",
    subscription: {
      plan: "Premium Individual",
      status: "Active",
      renewalDate: "",
      price: "$9.99/month",
    },
  };

  const today = new Date();
  const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
  const options = { year: "numeric", month: "long", day: "numeric" };
  userProfile.subscription.renewalDate = nextMonth.toLocaleDateString(
    "en-US",
    options
  );

  const userPlaylists = [
    {
      id: "1",
      title: "My Summer Mix",
      tracks: 24,
      cover: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "2",
      title: "Indie Discoveries",
      tracks: 42,
      cover: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "3",
      title: "Coding Focus",
      tracks: 18,
      cover: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "4",
      title: "Throwback Jams",
      tracks: 36,
      cover: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "5",
      title: "Chill Evening",
      tracks: 15,
      cover: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "6",
      title: "Workout Motivation",
      tracks: 28,
      cover: "/placeholder.svg?height=150&width=150",
    },
  ];

  const favoriteArtists = [
    {
      id: "1",
      name: "The Weeknd",
      followers: "85.4M",
      cover: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "2",
      name: "Taylor Swift",
      followers: "92.1M",
      cover: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "3",
      name: "Drake",
      followers: "76.8M",
      cover: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "4",
      name: "Billie Eilish",
      followers: "67.3M",
      cover: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "5",
      name: "Ed Sheeran",
      followers: "78.5M",
      cover: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "6",
      name: "Dua Lipa",
      followers: "65.9M",
      cover: "/placeholder.svg?height=150&width=150",
    },
  ];

  const recentlyPlayed = [
    {
      id: "1",
      title: "Blinding Lights",
      artist: "The Weeknd",
      cover: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "2",
      title: "As It Was",
      artist: "Harry Styles",
      cover: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "3",
      title: "Bad Habits",
      artist: "Ed Sheeran",
      cover: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "4",
      title: "Stay",
      artist: "The Kid LAROI, Justin Bieber",
      cover: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "5",
      title: "Heat Waves",
      artist: "Glass Animals",
      cover: "/placeholder.svg?height=60&width=60",
    },
  ];

  const userNfts = [
    {
      id: "nft1",
      title: "Cosmic Harmonies #12",
      artist: "Stellar Sound",
      imageUrl: "/placeholder.svg?height=150&width=150",
      price: "0.45 SOL",
      acquired: "2 months ago",
    },
    {
      id: "nft2",
      title: "Digital Dreamscape #7",
      artist: "Neon Collective",
      imageUrl: "/placeholder.svg?height=150&width=150",
      price: "1.2 SOL",
      acquired: "3 weeks ago",
    },
    {
      id: "nft3",
      title: "Rhythmic Revolution #23",
      artist: "Beat Masters",
      imageUrl: "/placeholder.svg?height=150&width=150",
      price: "0.8 SOL",
      acquired: "1 month ago",
    },
    {
      id: "nft4",
      title: "Sonic Serenity #5",
      artist: "Harmony Hub",
      imageUrl: "/placeholder.svg?height=150&width=150",
      price: "0.6 SOL",
      acquired: "2 weeks ago",
    },
  ];

  const transactions = [
    {
      id: "tx1",
      date: "Apr 15, 2025",
      description: "Premium Individual Subscription",
      amount: "$9.99",
      status: "Completed",
      paymentMethod: "Visa •••• 4242",
    },
    {
      id: "tx2",
      date: "Mar 15, 2025",
      description: "Premium Individual Subscription",
      amount: "$9.99",
      status: "Completed",
      paymentMethod: "Visa •••• 4242",
    },
    {
      id: "tx3",
      date: "Feb 15, 2025",
      description: "Premium Individual Subscription",
      amount: "$9.99",
      status: "Completed",
      paymentMethod: "Visa •••• 4242",
    },
    {
      id: "tx4",
      date: "Jan 15, 2025",
      description: "Premium Family Subscription",
      amount: "$14.99",
      status: "Completed",
      paymentMethod: "PayPal",
    },
    {
      id: "tx5",
      date: "Dec 15, 2024",
      description: "Premium Family Subscription",
      amount: "$14.99",
      status: "Completed",
      paymentMethod: "PayPal",
    },
  ];

  const paymentMethods = [
    {
      id: "pm1",
      type: "Visa",
      last4: "4242",
      expiry: "09/27",
      isDefault: true,
    },
    {
      id: "pm2",
      type: "PayPal",
      email: "john.doe@example.com",
      isDefault: false,
    },
  ];

  const getUserInitials = () => {
    if (!userProfile.name) return "U";
    return userProfile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleNavigateToNFT = (nftId: string) => {
    router.push(`/nft-marketplace/${nftId}`);
  };

  const handleNavigate = (destination: string) => {
    router.push("/subscriptions");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-6">
          <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{userProfile.name}</h2>
            <p className="text-sm text-muted-foreground mb-2">
              @{userProfile.username}
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <span className="font-bold">{userProfile.following}</span>{" "}
              Following
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>

          <div className="bg-card rounded-lg border overflow-hidden">
            <div className="p-4 bg-primary/10">
              <div className="flex justify-between items-center">
                <div className="font-semibold">Current Plan</div>
                <Badge variant="outline" className="bg-primary/20">
                  {userProfile.subscription.status}
                </Badge>
              </div>
              <div className="text-xl font-bold mt-1">
                {userProfile.subscription.plan}
              </div>
              <div className="text-sm text-muted-foreground mt-3">
                <div>{userProfile.subscription.price}</div>
                <div>Renews {userProfile.subscription.renewalDate}</div>
              </div>
            </div>
            <div className="p-4">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleNavigate("subscription")}
              >
                Manage Subscription
              </Button>
            </div>
          </div>

          <nav className="bg-card rounded-lg border overflow-hidden">
            <ul className="divide-y divide-border">
              <li>
                <button
                  className={`w-full flex items-center gap-3 p-3 text-left hover:bg-accent transition-colors ${
                    activeTab === "overview" ? "bg-accent" : ""
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span>Overview</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 p-3 text-left hover:bg-accent transition-colors ${
                    activeTab === "subscription" ? "bg-accent" : ""
                  }`}
                  onClick={() => setActiveTab("subscription")}
                >
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span>Subscription & Billing</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 p-3 text-left hover:bg-accent transition-colors ${
                    activeTab === "nfts" ? "bg-accent" : ""
                  }`}
                  onClick={() => setActiveTab("nfts")}
                >
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <span>My NFTs</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 p-3 text-left hover:bg-accent transition-colors ${
                    activeTab === "settings" ? "bg-accent" : ""
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <span>Account Settings</span>
                </button>
              </li>
              <li>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-accent transition-colors text-red-700">
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-4">Your Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <ListMusic className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Playlists Created
                        </div>
                        <div className="text-2xl font-bold">
                          {userPlaylists.length}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Hours Listened
                        </div>
                        <div className="text-2xl font-bold">247</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <Wallet className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          NFTs Owned
                        </div>
                        <div className="text-2xl font-bold">
                          {userNfts.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-4">Recently Played</h2>
                <div className="space-y-4">
                  {recentlyPlayed.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-4 rounded-md p-2 hover:bg-accent"
                    >
                      <img
                        src={track.cover || "/placeholder.svg"}
                        alt={track.title}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <div>
                        <div className="font-medium">{track.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {track.artist}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Your Playlists</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {userPlaylists.map((playlist) => (
                    <Card
                      key={playlist.id}
                      className="group cursor-pointer transition-all hover:bg-accent"
                      onClick={() =>
                        onNavigate && onNavigate("playlist", playlist.id)
                      }
                    >
                      <CardContent className="p-3">
                        <div className="overflow-hidden rounded-md">
                          <img
                            src={playlist.cover || "/placeholder.svg"}
                            alt={playlist.title}
                            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="mt-2">
                          <h3 className="font-semibold line-clamp-1">
                            {playlist.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {playlist.tracks} tracks
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "nfts" && (
            <div className="space-y-8">
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Your NFT Collection</h2>
                  <Button onClick={() => router.push("/nft-marketplace")}>
                    Browse Marketplace
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {userNfts.map((nft) => (
                    <Card
                      key={nft.id}
                      className="overflow-hidden cursor-pointer"
                      onClick={() => handleNavigateToNFT(nft.id)}
                    >
                      <div className="aspect-square relative">
                        <img
                          src={nft.imageUrl || "/placeholder.svg"}
                          alt={nft.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-primary/80">
                          NFT
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-sm font-bold truncate">
                          {nft.title}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {nft.artist}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-medium">
                            {nft.price}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "subscription" && (
            <div className="space-y-8">
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="p-6 bg-primary/10">
                  <h2 className="text-xl font-bold">Subscription Details</h2>
                  <p className="text-muted-foreground">
                    Manage your subscription and billing information
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Current Plan</h3>
                      <div className="bg-background rounded-lg p-4 border">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {userProfile.subscription.plan}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {userProfile.subscription.price}
                            </div>
                            <div className="flex items-center gap-1 mt-3">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Renews on{" "}
                                <span className="font-medium">
                                  {userProfile.subscription.renewalDate}
                                </span>
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-primary/20">
                            {userProfile.subscription.status}
                          </Badge>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              onNavigate && onNavigate("subscription")
                            }
                          >
                            Change Plan
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Payment Methods</h3>
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className="bg-background rounded-lg p-4 border"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                {method.type === "Visa" ? (
                                  <CreditCard className="h-5 w-5 text-primary" />
                                ) : (
                                  <svg
                                    className="h-5 w-5 text-primary"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    <rect
                                      width="18"
                                      height="11"
                                      x="3"
                                      y="11"
                                      rx="2"
                                      ry="2"
                                    />
                                  </svg>
                                )}
                                <div>
                                  <div className="font-medium">
                                    {method.type}{" "}
                                    {method.last4 ? `•••• ${method.last4}` : ""}
                                  </div>
                                  {method.expiry ? (
                                    <div className="text-sm text-muted-foreground">
                                      Expires {method.expiry}
                                    </div>
                                  ) : (
                                    <div className="text-sm text-muted-foreground">
                                      {method.email}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {method.isDefault && (
                                <Badge
                                  variant="outline"
                                  className="bg-primary/20"
                                >
                                  Default
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full">
                          Add Payment Method
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="p-6">
                  <h3 className="font-semibold mb-4">Transaction History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">
                            Date
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Description
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Amount
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Payment Method
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {transactions.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="hover:bg-accent/50"
                          >
                            <td className="py-3 px-4">{transaction.date}</td>
                            <td className="py-3 px-4">
                              {transaction.description}
                            </td>
                            <td className="py-3 px-4 font-medium">
                              {transaction.amount}
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant="outline"
                                className={
                                  transaction.status === "Completed"
                                    ? "bg-green-500/20 text-green-500"
                                    : "bg-amber-500/20 text-amber-500"
                                }
                              >
                                {transaction.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {transaction.paymentMethod}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-8">
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">
                        Personal Information
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={userProfile.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            defaultValue={userProfile.username}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            defaultValue={userProfile.email}
                          />
                        </div>
                      </div>
                      <Button className="mt-4">Save Changes</Button>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-4">Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">
                              Email Notifications
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Receive emails about your account activity
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">New Releases</div>
                            <div className="text-sm text-muted-foreground">
                              Get notified about new releases from artists you
                              follow
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Playlist Updates</div>
                            <div className="text-sm text-muted-foreground">
                              Get notified when playlists you follow are updated
                            </div>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-4">Privacy & Security</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">
                              Two-Factor Authentication
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Enable
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Private Session</div>
                            <div className="text-sm text-muted-foreground">
                              Listen privately without updating your listening
                              history
                            </div>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Data Sharing</div>
                            <div className="text-sm text-muted-foreground">
                              Share your listening data to improve
                              recommendations
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-4 text-destructive">
                        Danger Zone
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Delete Account</div>
                            <div className="text-sm text-muted-foreground">
                              Permanently delete your account and all your data
                            </div>
                          </div>
                          <Button variant="destructive" size="sm">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
