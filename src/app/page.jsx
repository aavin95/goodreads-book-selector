"use client";
import Head from "next/head";
import { isMobile, isTablet } from "react-device-detect";
import styled from "styled-components";
import BookSelector from "../components/BookSelector.js";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  padding-bottom: 40px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20px;
`;

const Text = styled.p`
  font-size: 16px;
  color: #4a5568;
`;

export default function Home() {
  const isMobileOrTablet = isMobile || isTablet;

  if (isMobileOrTablet) {
    return (
      <Container>
        <Head>
          <title>Site Not Supported</title>
        </Head>
        <Card>
          <Title>Currently Not Supported</Title>
          <Text>
            This site is currently not supported on mobile or tablet devices.
            Please access it on a desktop for the best experience.
          </Text>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Head>
        <title>Goodreads Book Selector</title>
        <meta
          name="description"
          content="Select a random book or filter by genre from your Goodreads to-read list"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BookSelector />
    </Container>
  );
}
