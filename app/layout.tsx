import type { Metadata } from "next";
import { Quantico } from "next/font/google";
import "./globals.css";
import PageContainer from "@/components/commonPages/PageContainer";
import Footer from "@/components/commonPages/Footer";
import Navbar from "@/components/commonPages/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ScrollArea } from "@/components/ui/scroll-area";

const quantico = Quantico({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fake News App",
  description: "Fake news detection app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${quantico.className} dark`}>
        <ScrollArea className="h-screen w-screen scroll-smooth">
          <SessionProvider session={session}>
            <PageContainer>
              <Navbar />
              {children}
              <Toaster />
              <Footer />
            </PageContainer>
          </SessionProvider>
          <Analytics />
          <SpeedInsights />
        </ScrollArea>
      </body>
    </html>
  );
}
