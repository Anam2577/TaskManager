"use client";
import { SessionProvider } from "next-auth/react";
import "./globals.css"; // Ensure you have standard Tailwind globals here

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}