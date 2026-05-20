import { Lora, Jersey_10, Silkscreen, Poppins } from 'next/font/google';
import ContextProvider from "@/component/helper/Context";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import SmoothScroll from '@/component/pages/SmoothScroll';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});

const jersey = Jersey_10({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-jersey',
});

const silkscreen = Silkscreen({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-silkscreen',
});

const poppins = Poppins({
  weight: ['100', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
});


export const metadata = {
  title:'Disibin',
  description: "Main home page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lora.variable}  ${jersey.variable} ${silkscreen.variable} ${poppins.variable} scroll-smooth antialiased bg-gray-100 w-full`}>
        <SmoothScroll>
          <ContextProvider>
          <Toaster position="top-right" />
          <main>{children}</main>
        </ContextProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
