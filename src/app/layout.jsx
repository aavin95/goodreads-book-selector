"use client";

import "./globals.css";
import { createGlobalStyle } from "styled-components";
import { Analytics } from "@vercel/analytics/react";
const GlobalStyle = createGlobalStyle`
  /* General global styles here */
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        <GlobalStyle />
        {children}
      </body>
    </html>
  );
}
