import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bdarchive.site"),
  title: "사무 유틸리티 - 업무에 필요한 모든 도구",
  description: "문서 변환, 날짜 계산, 파일 처리 등 사무 업무에 필요한 다양한 유틸리티를 제공합니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var h=location.host;if(h!=='bdarchive.site'&&h.indexOf('localhost')===-1){location.replace('https://bdarchive.site'+location.pathname+location.search+location.hash);}}catch(e){}})();`,
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9R933EXKXN"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-9R933EXKXN');
        `}</Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
