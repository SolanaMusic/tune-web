"use client";

import Link from "next/link";
import Image from "next/image";
import { Login } from "@/components/auth/login";
import { Register } from "@/components/auth/register";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Image src="/favicon.png" alt="favicon" width={40} height={40} />
          </div>
          <span className="text-lg font-semibold">Tune</span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center p-2 md:p-4 mt-[-20px] px-4 sm:px-6 md:px-0 space-y-6">
        <div className="w-full max-w-md space-y-6">
          <Tabs defaultValue="login" className="w-full">
            <div className="text-center mt-6">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold leading-tight">Welcome</h1>
                <p className="text-muted-foreground text-sm leading-snug">
                  Access your account below
                </p>
              </div>

              <div className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="login">
              <Login />
            </TabsContent>
            <TabsContent value="register">
              <Register />
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
