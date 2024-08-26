"use client";

import "./globals.css";
import { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
  /* General global styles here */
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GlobalStyle />
        {children}
      </body>
    </html>
  );
}
