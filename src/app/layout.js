import { Outfit } from "next/font/google";
import ContextProvider from "@/component/helper/Context";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: 'Disibin',
    template: '%s | Disibin'
  },
  description: "Main home page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} w-full overflow-x-hidden relative bg-white md:text-base text-sm`}>
        <ContextProvider>
          <main>{children}</main>
        </ContextProvider>
      </body>
    </html>
  );
}
