
import ContextProvider from "@/component/helper/Context";
import "./globals.css";


export const metadata = {
  title:{
    default:'Disibin',
    templet:'%s | Disibin'
  },
  description: "Main home page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="w-full overflow-x-hidden relative bg-white font-sans md:text-base text-xs">
        <ContextProvider>
          <main>{children}</main>
        </ContextProvider>
      </body>
    </html>
  );
}
