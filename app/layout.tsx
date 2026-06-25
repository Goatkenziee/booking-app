import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Booking App",
  description: "Book a session — choose your date and time",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ ["--font-sans" as string]: "Inter, system-ui, sans-serif" }}>
      <body>{children}</body>
    </html>
  );
}
