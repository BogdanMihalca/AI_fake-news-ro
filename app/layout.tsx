import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PageContainer from "@/components/commonPages/PageContainer";
import Footer from "@/components/commonPages/Footer";
import Navbar from "@/components/commonPages/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} dark`}>
        <SessionProvider session={session}>
          <PageContainer>
            <Navbar />
            {children}
            <Toaster />
            <Footer />
          </PageContainer>
        </SessionProvider>
      </body>
    </html>
  );
}
