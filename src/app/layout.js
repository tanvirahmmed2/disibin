import { Poppins } from "next/font/google";
import ContextProvider from "@/component/helper/Context";
import "./globals.css";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

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
      <body className={`${poppins.className} w-full overflow-x-hidden relative bg-white md:text-base text-sm`}>
        <ContextProvider>
          <main>{children}</main>
        </ContextProvider>
      </body>
    </html>
  );
}
