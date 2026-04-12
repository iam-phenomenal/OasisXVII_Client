import type { Metadata } from "next";
import { Epilogue, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-headline",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OasisXVII",
  description: "Built for the void.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark bg-background ${epilogue.variable} ${spaceGrotesk.variable} ${inter.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-background text-on-surface font-body antialiased selection:bg-primary selection:text-on-primary">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
