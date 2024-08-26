"use client";
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import styled from "styled-components";

async function checkRelevantSubjects(subjects) {
  const response = await fetch('/unique_genres.json');
  const genresJson = await response.json();
  const relevantGenres = Array.from(genresJson);
  let relevantSubjects = [];
  for (const genre of subjects) {
    if (relevantGenres.includes(genre)) {
      relevantSubjects.push(genre);
    } else {
      for (const word of genre.split(' ')) {
        if (relevantGenres.includes(word)) {
          if (!relevantSubjects.includes(word)) {
            relevantSubjects.push(word);
          }
        }
      }
    }
  }
  return relevantSubjects;
}

async function filterSubjects(subjects) {
  return Array.from(subjects.filter(subject => {
    const isEnglish = /^[a-zA-Z\s]+$/.test(subject);
    return isEnglish;
  }));
}

async function getBookDetailsFromGoodReads(ISBN, title) {
  const response = await fetch(`/api/bookDetails/${encodeURIComponent(ISBN)}/${encodeURIComponent(title)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch book details');
  }
  const bookData = await response.json();
  return bookData;
}

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

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #666666;
  margin-bottom: 10px;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 20px;
  margin-bottom: 0px;
  border-radius: 10px;
  border: 1px solid #e0e6ed;
  background-color: #f7f9fc;
  font-size: 14px;
  color: #333333;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    background-color: #ffffff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 12px 20px;
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid #e0e6ed;
  background-color: #f7f9fc;
  font-size: 14px;
  color: #333333;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    background-color: #ffffff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  border: 1px solid #e0e6ed;
  background-color: #f7f9fc;
  font-size: 14px;
  color: #333333;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    background-color: #ffffff;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const BottomButton = styled.button`
  width: 48%;
  padding: 12px 20px;
  background-color: #667eea;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5a67d8;
  }

  &:disabled {
    background-color: #cbd5e0;
    cursor: not-allowed;
  }
`;

const SelectedBookCard = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #f7fafc;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: left;
`;

const BookTitle = styled.h2`
  font-size: 18px;
  color: #2d3748;
  margin-bottom: 10px;
`;

const BookAuthor = styled.p`
  font-size: 16px;
  color: #4a5568;
`;

const BookList = styled.ul`
  margin-top: 20px;
  padding: 0;
  list-style-type: none;
  text-align: left;
  margin-bottom: 40px;
`;

const BookListItem = styled.li`
  padding: 10px;
  background-color: #f7fafc;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const LoadingIndicator = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Link = styled.a`
  color: #667eea;
  margin-bottom: 20px; 
  display: inline-block; 
  border-radius: 10px;
`;

const NewUploadButton = styled.button`
  width: 100%;
  padding: 12px 20px;
  background-color: #667eea;
  color: #ffffff;
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5a67d8;
  }

  &:disabled {
    background-color: #cbd5e0;
    cursor: not-allowed;
  }
`;

export default function BookSelector() {
  const [hasMounted, setHasMounted] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [values, setValues] = useState([]);
  const [unReadBooks, setUnReadBooks] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [Books, setBooks] = useState([]);
  const [fullList, setFullList] = useState([]); // State for holding the full list of books
  const [pasteContent, setPasteContent] = useState(""); // State for holding pasted content

  useEffect(() => {
    setHasMounted(true);

    const cachedBooks = localStorage.getItem('cachedBooks');
    const cachedGenres = localStorage.getItem('cachedGenres');
    const cachedFile = localStorage.getItem('cachedFile');
    const cachedFileName = localStorage.getItem('cachedFileName');

    if (cachedFileName) {
      setFileName(cachedFileName);
    }

    if (cachedFile && !cachedBooks) {
      parseData(new Blob([cachedFile], { type: 'text/csv' }));
    } else if (cachedBooks && cachedGenres) {
      setData(JSON.parse(cachedBooks));
      setGenreOptions(JSON.parse(cachedGenres));
      const unReadBooks = JSON.parse(cachedBooks).filter(
        (book) => book["Exclusive Shelf"] === "to-read"
      );
      setUnReadBooks(unReadBooks);
      setBooks(JSON.parse(cachedBooks));
    }
  }, []);

  if (!hasMounted) {
    return null;
  }

  const parseData = async (file) => {
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileContents = event.target.result;
      localStorage.setItem('cachedFile', fileContents);
      localStorage.setItem('cachedFileName', file.name);

      Papa.parse(fileContents, {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
          const columnsArray = [];
          const valuesArray = [];
          const genres = new Set();
          const parsedBooks = [];
          const unreadBooks = [];

          for (const row of results.data) {
            columnsArray.push(Object.keys(row));
            valuesArray.push(Object.values(row));
            if (row["Exclusive Shelf"] === "to-read") {
              unreadBooks.push(row);
            }
          }

          for (const row of unreadBooks) {
            if (row["Book Id"]) {
              try {
                const ISBN = row["ISBN"] ? row["ISBN"] : "";

                const bookDetails = await getBookDetailsFromGoodReads(ISBN, row["Title"]);
                parsedBooks.push({ ...row, genres: bookDetails.genres, image: bookDetails.image });
                bookDetails.genres.forEach(genre => genres.add(genre));
              } catch (error) {
                console.error(`Failed to fetch details for book ${row["Book Id"]}:`, error);
              }
            }
          }
          const filteredGenres = await filterSubjects(Array.from(genres));
          const relevantGenres = await checkRelevantSubjects(filteredGenres);
          const lowercasedGenres = relevantGenres.map(genre => genre.toLowerCase());

          const filteredBooks = parsedBooks.map(book => {
            const filteredGenres = book.genres.filter(genre => lowercasedGenres.includes(genre.toLowerCase()));

            return {
              ...book,
              genres: filteredGenres
            };
          });
          setData(filteredBooks);
          setColumns(columnsArray);
          setValues(valuesArray);
          setGenreOptions(["all", ...lowercasedGenres]);
          setUnReadBooks(filteredBooks);

          localStorage.setItem('cachedBooks', JSON.stringify(parsedBooks));
          localStorage.setItem('cachedGenres', JSON.stringify(["all", ...lowercasedGenres]));
          setBooks(parsedBooks);
          setLoading(false);
        },
      });
    };
    reader.readAsText(file);
  };

  const handlePasteContent = () => {
    setLoading(true);

    Papa.parse(pasteContent, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        const columnsArray = [];
        const valuesArray = [];
        const genres = new Set();
        const parsedBooks = [];
        const unreadBooks = [];

        for (const row of results.data) {
          columnsArray.push(Object.keys(row));
          valuesArray.push(Object.values(row));
          if (row["Exclusive Shelf"] === "to-read") {
            unreadBooks.push(row);
          }
        }

        for (const row of unreadBooks) {
          if (row["Book Id"]) {
            try {
              let ISBN;
              if (row["ISBN"].length === 10) {

                ISBN = row["ISBN"];
              }
              else {
                ISBN = " ";
              }
              const bookDetails = await getBookDetailsFromGoodReads(ISBN, row["Title"]);
              parsedBooks.push({ ...row, genres: bookDetails.genres, image: bookDetails.image });
              bookDetails.genres.forEach(genre => genres.add(genre));
            } catch (error) {
              console.error(`Failed to fetch details for book ${row["Book Id"]}:`, error);
            }
          }
        }
        const filteredGenres = await filterSubjects(Array.from(genres));
        const relevantGenres = await checkRelevantSubjects(filteredGenres);
        const lowercasedGenres = relevantGenres.map(genre => genre.toLowerCase());

        const filteredBooks = parsedBooks.map(book => {
          const filteredGenres = book.genres.filter(genre => lowercasedGenres.includes(genre.toLowerCase()));

          return {
            ...book,
            genres: filteredGenres
          };
        });
        setData(filteredBooks);
        setColumns(columnsArray);
        setValues(valuesArray);
        setGenreOptions(["all", ...lowercasedGenres]);
        setUnReadBooks(filteredBooks);

        localStorage.setItem('cachedBooks', JSON.stringify(parsedBooks));
        localStorage.setItem('cachedGenres', JSON.stringify(["all", ...lowercasedGenres]));
        setBooks(parsedBooks);
        setLoading(false);
      },
    });
  };

  const handleRandomBook = () => {
    setFullList([]); // Clear the full list
    const filteredBooks =
      selectedGenre === "all"
        ? unReadBooks
        : unReadBooks.filter((book) => {
          return book.genres.some(genre => genre.toLowerCase() === selectedGenre.toLowerCase());
        });

    if (filteredBooks.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredBooks.length);
      const randomBook = filteredBooks[randomIndex];

      setSelectedBook({
        title: randomBook.Title,
        author: randomBook.Author,
        genre: randomBook.genres.join(", "),
        image: randomBook.image,
      });
    } else {
      setSelectedBook({
        title: "No books available",
        author: "Please try a different genre.",
        genre: "",
        image: null,
      });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    parseData(file);
  };

  const handleNewUpload = () => {
    setFileName("");
    setBooks([]);
    localStorage.removeItem('cachedBooks');
    localStorage.removeItem('cachedGenres');
    localStorage.removeItem('cachedFile');
    localStorage.removeItem('cachedFileName');
    setData([]);
    setGenreOptions([]);
    setUnReadBooks([]);
    setSelectedBook(null);
    setPasteContent("");
  }

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleFullList = () => {
    setSelectedBook(null); // Clear the selected book
    const filteredBooks =
      selectedGenre === "all"
        ? unReadBooks
        : unReadBooks.filter((book) => {
          return book.genres.some(genre => genre.toLowerCase() === selectedGenre.toLowerCase());
        });

    if (filteredBooks.length > 0) {
      setFullList(filteredBooks); // Set the full list of books to display
    } else {
      setSelectedBook({
        title: "No books available",
        author: "Please try a different genre.",
        genre: "",
        image: null,
      });
      setFullList([]); // Clear the full list
    }
  };

  return (
    <Container>
      <Card>
        <Title>Goodreads Random Book Selector</Title>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <form>
            {fileName ? (
              <div>
                <p>Uploaded: {fileName}</p>
                <NewUploadButton
                  type="button"
                  onClick={handleNewUpload}
                >
                  Upload New File
                </NewUploadButton>
              </div>
            ) : (
              <div>
                <Label>Upload Goodreads CSV</Label>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
                {/*<Label>Or Paste CSV Content</Label>
                <TextArea
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                />*/}
                <NewUploadButton
                  type="button"
                  onClick={handlePasteContent}
                  disabled={!pasteContent.trim()}
                >
                  Process Pasted CSV
                </NewUploadButton>
                <Link href="https://www.goodreads.com/review/import" target="_blank">How to export your Goodreads to-read list</Link>
              </div>
            )}
            <div>
              <Label>Select Genre</Label>
              <Select
                value={selectedGenre}
                onChange={handleGenreChange}
                disabled={genreOptions.length === 0}
              >
                {genreOptions.map((genre, index) => (
                  <option key={index} value={genre}>
                    {genre}
                  </option>
                ))}
              </Select>
            </div>
            <ButtonContainer>
              <BottomButton
                type="button"
                onClick={handleRandomBook}
                disabled={unReadBooks.length === 0}
              >
                Random
              </BottomButton>
              <BottomButton
                type="button"
                onClick={handleFullList}
                disabled={unReadBooks.length === 0}
              >
                Full List
              </BottomButton>
            </ButtonContainer>
          </form>
        )}
        {selectedBook && (
          <SelectedBookCard>
            <BookTitle>{selectedBook.title}</BookTitle>
            <BookAuthor>{selectedBook.author}</BookAuthor>
          </SelectedBookCard>
        )}
        {fullList.length > 0 && (
          <BookList>
            {fullList.map((book, index) => (
              <BookListItem key={index}>
                <strong>{book.Title}</strong> by {book.Author}
              </BookListItem>
            ))}
          </BookList>
        )}
      </Card>
    </Container>
  );
}
