// pages/index.js
"use client";
import Head from "next/head";
import BookSelector from "../components/BookSelector.js";

export default function Home() {
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
