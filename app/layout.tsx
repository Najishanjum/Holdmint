import type { Metadata } from "next";
import { Inter, Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { VaultProvider } from "@/lib/store/vault-store";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-display",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "HoldMint — Neo-Brutalist Solana Income Splitter",
  description:
    "Earn freely. Save automatically. Protect your tax money. Non-custodial Solana financial protocol dividing incoming USDC into Spend, Tax, and Savings vaults.",
  keywords: [
    "Solana",
    "Anchor",
    "Fintech",
    "HoldMint",
    "USDC",
    "Neo-Brutalist",
    "Non-custodial",
    "Web3 Dashboard",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${barlowCondensed.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-primary-text min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <VaultProvider>{children}</VaultProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
