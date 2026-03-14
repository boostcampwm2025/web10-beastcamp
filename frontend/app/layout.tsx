import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { TicketProvider } from "../contexts/TicketContext";
import { ResultProvider } from "../contexts/ResultContext";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "./_source/components/Header";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const SITE_TITLE = "내티켓 - 티켓팅 연습 & 시뮬레이션";
const SITE_DESCRIPTION =
  "티켓팅 연습 사이트. 실전과 같은 환경에서 봇과 경쟁하며 티켓팅 연습을 해보세요.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.neticket.site"),
  title: {
    default: SITE_TITLE,
    template: "%s | 내티켓",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "티켓팅 연습",
    "티켓팅 시뮬레이션",
    "티켓팅 연습 사이트",
    "인터파크 티켓팅 연습",
    "예스24 티켓팅 연습",
    "멜론티켓 티켓팅 연습",
    "임영웅 티켓팅",
    "내티켓",
    "neticket",
  ],
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "8rsMMOA_qKOvtut0rhVU-GF4enkFaTm0g0mOmjYUVWk",
  },
  alternates: {
    canonical: "https://www.neticket.site",
  },

  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "https://www.neticket.site",
    siteName: "내티켓",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/open_graph.png",
        width: 1200,
        height: 630,
        alt: "내티켓 서비스 이미지",
      },
    ],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <Header />
            <ResultProvider>
              <TicketProvider>{children}</TicketProvider>
            </ResultProvider>
          </AuthProvider>
        </QueryProvider>
        <Toaster />
      </body>

      <GoogleAnalytics gaId="G-MJVW856FVF" />
    </html>
  );
}
