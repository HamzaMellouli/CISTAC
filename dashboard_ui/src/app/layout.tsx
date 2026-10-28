import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "AI4Brain — Neurocognitive Assessment & Training Engine",
  description: "Calm Precision Neuro-Responsive Cognitive Assessment & Growth Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-accent/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
