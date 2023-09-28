import { Raleway } from "next/font/google";
import Navbar from "~/components/Navbar";

// If loading a variable font, you don't need to specify the font weight
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
      <Navbar />
      <div className={raleway.className}>{children}</div>
    </main>
  );
}
