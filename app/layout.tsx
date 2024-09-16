import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leaves Manager | Manage Employee Leaves Efficiently",
  description:
    "Leaves Manager is an efficient and secure platform to manage employee leave requests, approvals, and notifications.",
  keywords:
    "leave management, employee leave, HR tool, leave tracker, leaves manager",

  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
    apple: "/icons/icon-192x192.png", // For Apple devices
  },

  manifest: "/manifest.json",
  openGraph: {
    title: "Leaves Manager | Manage Employee Leaves Efficiently",
    description:
      "Leaves Manager is an efficient and secure platform to manage employee leave requests, approvals, and notifications.",
    url: "https://primasoft.netlify.app",
    images: [
      {
        url: "https://primasoft.netlify.app/icons/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Leaves Manager Logo",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leaves Manager | Manage Employee Leaves Efficiently",
    description:
      "Leaves Manager is an efficient and secure platform to manage employee leave requests, approvals, and notifications.",
    images: "https://primasoft.netlify.app/icons/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="index, follow" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <link rel="canonical" href="https://primasoft.netlify.app" />
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
