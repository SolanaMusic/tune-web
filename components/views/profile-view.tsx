"use client";

import { useEffect, useMemo, useState } from "react";
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
  Wallet,
  ListMusic,
  Loader2,
  Receipt,
  SquarePen,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/UserStore";
import axios from "axios";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

export function ProfileView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [profile, setProfile] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [userToUpdate, setUserToUpdate] = useState<any>();
  const router = useRouter();
  const { user, setUser, logout } = useUserStore();

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [network]
  );

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [profileRes, subRes, recRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}users/${user?.id}`),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}subscriptions/${user?.id}`
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}tracks/recently-played/${user?.id}`
          ),
        ]);

        setProfile(profileRes.data);
        setSubscriptions(subRes.data);
        setRecentlyPlayed(recRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getUserInitials = () => {
    if (!user?.name) return "U";

    return user?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();

    const disconnectBtn = document.querySelector<HTMLButtonElement>(
      ".wallet-adapter-button.wallet-adapter-button-trigger"
    );

    if (disconnectBtn) disconnectBtn.click();

    router.push("/");
  };

  const deleteUser = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}users/${user?.id}`
      );

      setIsDeleteDialogOpen(false);
      handleLogout();
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const updateUser = async () => {
    try {
      const formData = new FormData();

      if (userToUpdate.username)
        formData.append("UserName", userToUpdate.username);
      if (userToUpdate.avatar) {
        formData.append("Avatar", userToUpdate.avatar);
      }

      setIsSaving(true);
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}users/${user?.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setProfile(response.data);
      setIsSaving(false);
      setUserToUpdate(null);

      if (user) {
        setUser({
          id: user.id,
          role: user.role,
          tokensAmount: user.tokensAmount,
          token: user.token,
          avatar: getAvatarUrl(response.data.profile.avatarUrl),
          name: response.data.userName,
        });
      }
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const getAvatarUrl = (avatarUrl: string) => {
    if (!avatarUrl) return "/placeholder.svg";

    return avatarUrl.startsWith("http")
      ? avatarUrl
      : `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${avatarUrl}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserToUpdate((prev) => ({ ...prev, avatar: file }));
    }
  };

  function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }

  function splitByCaps(text: string): string {
    if (!text) return "";
    return text.replace(/([A-Z])/g, " $1").trim();
  }

  const activeOrLatestSubscription = (() => {
    if (!subscriptions || subscriptions.length === 0) return null;

    const activeSub = subscriptions.find((s) => s.isActive);
    if (activeSub) return activeSub;

    return subscriptions.reduce((prev, curr) => {
      return new Date(curr.endDate) > new Date(prev.endDate) ? curr : prev;
    }, subscriptions[0]);
  })();

  const statusStyles: Record<string, string> = {
    Completed: "bg-green-500/20 text-green-500",
    Pending: "bg-blue-500/20 text-blue-500",
    Failed: "bg-red-500/20 text-red-500",
    Refunded: "bg-amber-500/20 text-amber-500",
    Expired: "bg-gray-500/20 text-gray-500",
    Unknown: "bg-muted/20 text-muted-foreground",
  };

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
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 space-y-6">
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border">
                <div className="relative inline-block">
                  <Avatar className="h-20 w-20 cursor-pointer">
                    <AvatarImage
                      src={
                        userToUpdate?.avatar
                          ? URL.createObjectURL(userToUpdate.avatar)
                          : getAvatarUrl(profile.profile.avatarUrl)
                      }
                      alt={profile.userName}
                    />
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>

                  {activeTab === "settings" && (
                    <>
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full cursor-pointer flex items-center justify-center"
                      >
                        <SquarePen className="w-4 h-4" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </>
                  )}
                </div>
                <h2 className="text-xl font-bold mt-2">{profile.userName}</h2>
                <div className="flex justify-center gap-4 text-sm mt-2">
                  <span className="font-bold">{profile.following}</span>{" "}
                  Following
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  disabled={activeTab === "settings"}
                  onClick={() => setActiveTab("settings")}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </div>

              {activeOrLatestSubscription && (
                <div className="bg-card rounded-lg border overflow-hidden">
                  <div
                    className={`p-4 ${
                      activeOrLatestSubscription.isActive
                        ? "bg-primary/10"
                        : "bg-gray-50/50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">Current Plan</div>
                      <Badge
                        variant="outline"
                        className={`${
                          activeOrLatestSubscription.isActive
                            ? "bg-primary/20"
                            : "bg-gray-200/30 text-white border-gray-300"
                        }`}
                      >
                        {activeOrLatestSubscription.isActive
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                    </div>

                    <div className="text-xl font-bold mt-1">
                      {activeOrLatestSubscription.subscriptionPlan.name}
                    </div>

                    <div
                      className={`text-sm mt-3 ${
                        activeOrLatestSubscription.isActive
                          ? "text-muted-foreground"
                          : "text-gray-200"
                      }`}
                    >
                      <div>
                        {(() => {
                          const usdCurrency =
                            activeOrLatestSubscription.subscriptionPlan.subscriptionPlanCurrencies.find(
                              (c) => c.currency.code === "USD"
                            );

                          return usdCurrency
                            ? `${usdCurrency.currency.symbol}${usdCurrency.price}/month`
                            : "N/A";
                        })()}
                      </div>
                      <div>
                        Renews{" "}
                        {new Date(
                          activeOrLatestSubscription.endDate
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => router.push("/subscriptions")}
                    >
                      Manage Subscription
                    </Button>
                  </div>
                </div>
              )}

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
                        activeTab === "transactions" ? "bg-accent" : ""
                      }`}
                      onClick={() => setActiveTab("transactions")}
                    >
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <span>Transactions</span>
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
                    <WalletDisconnectButton
                      style={{
                        opacity: 0,
                        position: "absolute",
                        pointerEvents: "none",
                      }}
                    />
                    <button
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-accent transition-colors text-red-700"
                      onClick={handleLogout}
                    >
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
                              {profile.playlists.length}
                            </div>
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
                              {profile.nfts.length}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-background rounded-lg p-4 border">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/20 p-2 rounded-full">
                            <Receipt className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Transactions processed
                            </div>
                            <div className="text-2xl font-bold">
                              {profile.transactions.length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {recentlyPlayed.length > 0 && (
                    <div className="bg-card rounded-lg border p-6">
                      <h2 className="text-xl font-bold mb-4">
                        Recently Played
                      </h2>
                      <div className="space-y-4">
                        {recentlyPlayed.map((track) => (
                          <div
                            key={track.id}
                            className="flex items-center gap-4 rounded-md p-2 hover:bg-accent cursor-pointer"
                            onClick={() => router.push(`/tracks/${track.id}`)}
                          >
                            <img
                              src={
                                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${track.imageUrl}` ||
                                "/placeholder.svg"
                              }
                              alt={track.title}
                              className="h-12 w-12 rounded-md object-cover"
                            />
                            <div>
                              <div className="font-medium">{track.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {track.artists.map((artist, index) => (
                                  <span
                                    key={artist.id}
                                    className="hover:underline cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/artists/${track.id}`);
                                    }}
                                  >
                                    {artist.name}
                                    {index < track.artists.length - 1 && ", "}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.playlists.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Your Playlists</h2>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {profile.playlists.map((playlist) => (
                          <Card
                            key={playlist.id}
                            className="group cursor-pointer transition-all hover:bg-accent"
                          >
                            <CardContent className="p-3">
                              <div className="overflow-hidden rounded-md">
                                <img
                                  src={
                                    `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${playlist.coverUrl}` ||
                                    "/placeholder.svg"
                                  }
                                  alt={playlist.name}
                                  className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <div className="mt-2">
                                <h3 className="font-semibold line-clamp-1">
                                  {playlist.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {playlist.tracksCount} track
                                  {playlist.tracksCount !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "nfts" && (
                <div className="space-y-8">
                  <div className="bg-card rounded-lg border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">Your NFTs</h2>
                      <Button onClick={() => router.push("/nft-marketplace")}>
                        Browse Marketplace
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      {profile.nfts.map((nft) => (
                        <Card
                          key={nft.id}
                          className="overflow-hidden cursor-pointer"
                          onClick={() =>
                            router.push(`/nft-marketplace/nft/${nft.id}`)
                          }
                        >
                          <div className="aspect-square relative">
                            <img
                              src={nft.imageUrl || "/placeholder.svg"}
                              alt={nft.name}
                              className="w-full h-full object-cover"
                            />
                            <Badge
                              variant="outline"
                              className={`text-xs absolute top-2 right-2 ${
                                nft.rarity === "Legendary"
                                  ? "border-yellow-500 text-yellow-500"
                                  : nft.rarity === "Mythic"
                                  ? "border-red-500 text-red-500"
                                  : nft.rarity === "Epic"
                                  ? "border-purple-500 text-purple-500"
                                  : nft.rarity === "Rare"
                                  ? "border-green-500 text-green-500"
                                  : "border-blue-500 text-blue-500"
                              }`}
                            >
                              {nft.rarity}
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="text-sm font-bold truncate">
                              {nft.name}
                            </h3>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm font-medium">
                                {nft.price} {nft.currency.code}
                              </span>
                              <span className="text-sm text-muted-foreground opacity-70">
                                {timeAgo(nft.updatedDate)}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "transactions" && (
                <div className="space-y-8">
                  <div className="bg-card rounded-lg border overflow-hidden">
                    <div className="p-6 bg-primary/10">
                      <h3 className="font-bold">Transactions History</h3>
                    </div>
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
                          {profile.transactions.map((transaction) => (
                            <tr
                              key={transaction.id}
                              className="hover:bg-accent/50"
                            >
                              <td className="py-3 px-4">
                                {new Date(
                                  transaction.createdDate
                                ).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                {splitByCaps(transaction.transactionType)}
                              </td>
                              <td className="py-3 px-4 font-medium">
                                {transaction.amount} {transaction.currency.code}
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant="outline"
                                  className={
                                    statusStyles[transaction.status] ||
                                    "bg-muted/20 text-muted-foreground"
                                  }
                                >
                                  {transaction.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {splitByCaps(transaction.paymentMethod)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-8">
                  <div className="bg-card rounded-lg border overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-6">
                        Account Settings
                      </h2>
                      <div className="space-y-6">
                        <Separator />
                        <div>
                          <h3 className="font-semibold mb-4">
                            Personal Information
                          </h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="username">Username</Label>
                              <Input
                                id="username"
                                defaultValue={profile.userName}
                                onChange={(e) =>
                                  setUserToUpdate((prev: any) => ({
                                    ...prev,
                                    username: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                defaultValue={profile.email}
                                disabled={true}
                              />
                            </div>
                          </div>
                          <Button
                            className="mt-4"
                            onClick={updateUser}
                            disabled={
                              isSaving ||
                              (!userToUpdate?.avatar &&
                                (!userToUpdate?.username ||
                                  userToUpdate?.username === profile.userName))
                            }
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
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
                                  Get notified about new releases from artists
                                  you follow
                                </div>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <div className="font-medium">
                                  Playlist Updates
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Get notified when playlists you follow are
                                  updated
                                </div>
                              </div>
                              <Switch />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-semibold mb-4">
                            Privacy & Security
                          </h3>
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
                                <div className="font-medium">
                                  Private Session
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Listen privately without updating your
                                  listening history
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
                        <AlertDialog
                          open={isDeleteDialogOpen}
                          onOpenChange={setIsDeleteDialogOpen}
                        >
                          <AlertDialogContent className="w-[90vw] rounded">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Account
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {`Are you sure you want to delete your account ${user?.name}?`}
                                <p>This action cannot be undone</p>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => {
                                  setIsDeleteDialogOpen(false);
                                }}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={deleteUser}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <div>
                          <h3 className="font-semibold mb-4 text-destructive">
                            Danger Zone
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <div className="font-medium">
                                  Delete Account
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Permanently delete your account and all your
                                  data
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setIsDeleteDialogOpen(true)}
                              >
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
      </WalletProvider>
    </ConnectionProvider>
  );
}
