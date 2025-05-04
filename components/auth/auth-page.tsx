"use client";

import Link from "next/link";
import Image from "next/image";
import { Login } from "@/components/auth/login";

export function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Image src="/favicon.png" alt="favicon" width={40} height={40} />
          </div>
          <span className="text-lg font-semibold">Tune</span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center p-2 md:p-4 mt-[-20px]">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to continue to Tune</p>
          </div>
          <Login />
        </div>
      </div>

      <div className="border-t py-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Tune. All rights reserved.
      </div>
    </div>
  );
}
