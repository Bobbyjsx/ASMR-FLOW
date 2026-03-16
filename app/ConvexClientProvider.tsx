"use client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Convex Configuration Required</h2>
          <p className="text-gray-600 mb-4 text-sm">
            To use ConvexDB, you need to provide your <code>NEXT_PUBLIC_CONVEX_URL</code> in the environment variables.
          </p>
          <div className="bg-gray-50 p-4 rounded-xl text-left text-sm text-gray-700 mb-4">
            <ol className="list-decimal list-inside space-y-2">
              <li>Export this project</li>
              <li>Run <code>npx convex dev</code> locally</li>
              <li>Copy the generated URL</li>
              <li>Add it to the AI Studio Settings</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
