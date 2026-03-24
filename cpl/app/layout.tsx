import "./globals.css";
import type { Metadata } from "next";
import Header from './header'
import Login from './login'

export const metadata: Metadata = {
  title: "Cubicle Pokemon League",
  // description: "",
};

export default function RootLayout
  (
    { children, }: Readonly<{ children: React.ReactNode; }>
  ) {
  return (
    <html lang="en">
      <body className="body">
        <div className="layout">

          <div className="header">
            <Header />
          </div>
          {/* 
          <div className="login">
            <Login />
          </div> */}

          <div className="main">
            {children}
          </div>

          <div className="footer">
            ()cubicle
          </div>

        </div>
      </body>
    </html>
  );
}