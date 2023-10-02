import { Raleway } from "next/font/google";

const raleway = Raleway({
  variable: "--raleway-font",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative">
      <div className={raleway.className}>{children}</div>
    </main>
  );
}
