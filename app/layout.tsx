import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { VaultProvider } from "@/lib/store/vault-store";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Tax Vault — Non-Custodial Solana Income & Tax Splitter",
  description:
    "Earn freely. Save automatically. Protect your tax money. Non-custodial Solana financial application that splits incoming USDC payments into Spend, Tax, and Savings vaults at the source.",
  keywords: [
    "Solana",
    "Anchor",
    "Fintech",
    "Tax Vault",
    "USDC",
    "Freelancer Taxes",
    "Non-custodial",
    "Smart Contract",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-primary min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <VaultProvider>{children}</VaultProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
