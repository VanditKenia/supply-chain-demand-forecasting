import "./globals.css";

export const metadata = {
  title: "Supply Intelligence",
  description: "Interactive supply-chain intelligence platform",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
