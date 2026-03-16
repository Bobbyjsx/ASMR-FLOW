import type { Metadata } from 'next';
import './globals.css'; // Global styles
import ConvexClientProvider from "./ConvexClientProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import VideoPollingManager from "@/components/VideoPollingManager";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'ASMR Flow',
  description: 'AI-powered ASMR video production studio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body suppressHydrationWarning>
        <ConvexClientProvider>
          <AuthProvider>
            <VideoPollingManager />
            {children}
            <Toaster />
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

