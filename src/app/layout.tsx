import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";

const notoSansSC = Noto_Sans_SC({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "以太坊罗盘 - Ethereum Compass",
  description: "以太坊价格、新闻、Treasury公司状态和重要声音的聚合平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${notoSansSC.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
