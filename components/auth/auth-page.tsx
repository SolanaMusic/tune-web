"use client";

import Link from "next/link";
import Image from "next/image";
import { Login } from "@/components/auth/login";
import { Register } from "@/components/auth/register";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";

export function AuthPage() {
  const [refCode, setRefCode] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("ref");
    setRefCode(code);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex h-16 items-center border-b px-6 justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Image src="/favicon.png" alt="favicon" width={40} height={40} />
          </div>
          <span className="text-lg font-semibold">Tune</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 md:px-0">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold leading-tight">Welcome</h1>
              <p className="text-muted-foreground text-sm leading-snug mt-1">
                Access your account below
              </p>
            </div>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Login referralCode={refCode} />
            </TabsContent>
            <TabsContent value="register">
              <Register referralCode={refCode} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="border-t py-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Tune. All rights reserved.
      </div>
    </div>
  );
}
