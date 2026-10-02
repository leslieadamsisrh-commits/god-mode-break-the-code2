import type {Metadata} from "next";
import "./globals.css";
export const metadata:Metadata={title:"GOD MODE · Combat Master Studio",description:"Permanent GOD MODE combat development cockpit"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
