"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "@privy-io/wagmi";
import { config } from "@/lib/privy/config";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#EB83EA",
          logo: undefined,
          landingHeader: "Welcome to Dragverse",
          loginMessage: "Sign in to upload, like, and comment on drag content",
        },
        loginMethods: ["email", "google", "discord", "farcaster"],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#18122D",
                  color: "#FCF1FC",
                  border: "1px solid #2f2942",
                },
                success: {
                  iconTheme: {
                    primary: "#EB83EA",
                    secondary: "#FCF1FC",
                  },
                },
              }}
            />
          </ThemeProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
