"use client";
import Head from "next/head";
import { isMobile, isTablet } from "react-device-detect";
import BookSelector from "../components/BookSelector.js";

export default function Home() {
  const isMobileOrTablet = isMobile || isTablet;

  if (isMobileOrTablet) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Head>
          <title>Site Not Supported</title>
        </Head>
        <div className="text-center p-5 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Currently Not Supported</h1>
          <p className="text-lg">
            This site is currently not supported on mobile or tablet devices.
            Please access it on a desktop for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Head>
        <title>Goodreads Book Selector</title>
        <meta
          name="description"
          content="Select a random book or filter by genre from your Goodreads to-read list"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BookSelector />
    </div>
  );
}
