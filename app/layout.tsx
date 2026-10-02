import type {Metadata,Viewport} from "next";
import "./globals.css";
export const metadata:Metadata={
  title:"GOD MODE · Combat Master Studio",
  description:"Permanent GOD MODE combat development cockpit",
  manifest:"/manifest.webmanifest",
  appleWebApp:{capable:true,statusBarStyle:"black-translucent",title:"GOD MODE"}
};
export const viewport:Viewport={width:"device-width",initialScale:1,maximumScale:1,userScalable:false,viewportFit:"cover",themeColor:"#05080c"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
