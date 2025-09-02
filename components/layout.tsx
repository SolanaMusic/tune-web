"use client";

import type React from "react";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Player } from "@/components/player";
import { ThemeProvider } from "@/components/theme-provider";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div
        className="flex h-screen flex-col bg-background text-foreground"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto pb-24">{children}</main>
        </div>
        <Player />
      </div>
    </ThemeProvider>
  );
}
