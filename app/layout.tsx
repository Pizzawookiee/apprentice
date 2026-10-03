import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "The AI Apprentice", description: "Capture judgment. Map work. Teach the next generation." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
