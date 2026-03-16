import type { Metadata } from 'next';
import './globals.css'; // Global styles
import ConvexClientProvider from "./ConvexClientProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Raleway, Lora } from "next/font/google";
import { cn } from "@/lib/utils";
import VideoPollingManager from "@/components/VideoPollingManager";
import { Toaster } from "@/components/ui/sonner";

const raleway = Raleway({ subsets: ['latin'], variable: '--font-sans' });
const lora = Lora({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'ASMR Flow',
  description: 'AI-powered ASMR video production studio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", raleway.variable, lora.variable)}>
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

