"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  X,
  User,
  LayoutDashboard,
  LogOut,
  Music2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import { useUserStore } from "@/stores/UserStore";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

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

  const getUserInitials = () => {
    if (!user?.name) return "U";

    return user.name
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

    if (pathname.startsWith("/profile")) {
      router.push("/");
    }
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <header className="sticky z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <MobileSidebar />
              </SheetContent>
            </Sheet>

            <Link href="/" className="hidden items-center gap-3 md:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Image
                  src="/favicon.png"
                  alt="favicon"
                  width={40}
                  height={40}
                />
              </div>
              <span className="text-lg font-semibold">Tune</span>
            </Link>
          </div>

          <div
            className={`absolute left-1/2 -translate-x-1/2 transform transition-all duration-200 ${
              isSearchOpen ? "w-full max-w-md px-4 md:px-0" : "w-64 md:w-80"
            }`}
          >
            {isSearchOpen ? (
              <div className="relative flex items-center">
                <Input
                  placeholder="Search for songs, artists, or playlists..."
                  className="pl-10 pr-10"
                  autoFocus
                />
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 h-full"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="hidden w-full justify-start text-muted-foreground md:flex"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <ThemeToggle />

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            {user ? (
              <DropdownMenu>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-2 py-1 md:px-3 md:py-1.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Music2 className="h-3.5 w-3.5 ml-0.5" />
                  </div>
                  <span className="text-sm font-medium">
                    {user.tokensAmount}
                  </span>
                  <span className="text-xs text-muted-foreground hidden md:inline">
                    TUNE
                  </span>
                </div>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2"
                  >
                    <Avatar className="h-8 w-8 border border-[hsl(var(--primary))]">
                      <AvatarImage
                        src={user.avatar}
                        alt={`${user.name} avatar`}
                      />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  {user.role === "Admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <WalletDisconnectButton
                    style={{
                      opacity: 0,
                      position: "absolute",
                      pointerEvents: "none",
                    }}
                  />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="w-full flex items-center text-left hover:bg-accent transition-colors text-red-700"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </header>
      </WalletProvider>
    </ConnectionProvider>
  );
}
