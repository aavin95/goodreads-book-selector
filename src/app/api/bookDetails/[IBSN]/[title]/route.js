import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
    const { IBSN, title } = params;

    if (!IBSN && !title) {
        return NextResponse.json({ error: 'Book title is required' }, { status: 400 });
    }

    try {
        // Replace spaces with '+' for the query
        const reqIBSN = IBSN.replace(/ /g, '+');
        let reqTitle = title.replace(/ /g, '+');
        reqTitle = reqTitle.split('(')[0]; // Remove anything in parentheses b/c the API doesn't like it
        if (reqIBSN == "" && reqTitle == "") {
            console.log("Book title is required");
            return NextResponse.json({ error: 'Book title is required' }, { status: 400 });
        }
        let searchUrl;
        if (reqIBSN.length != 13) {
            searchUrl = `https://openlibrary.org/search.json?q=${reqTitle}&limit=1&fields=title,author_name,subject`;
        }
        else {
            searchUrl = `https://openlibrary.org/search.json?q=${reqIBSN}&limit=1&fields=title,author_name,subject`;
        }
        // Fetch the data from the Open Library API
        console.log(searchUrl);
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.numFound === 0) {
            return NextResponse.json({ error: 'No books found with that title' }, { status: 404 });
        }

        // Get the first result (most relevant)
        const book = data.docs[0];

        // Extract the genre/subjects from the first edition info
        const genres = book.subject ? book.subject : ['No genres found'];

        // Return the genres in the response
        return NextResponse.json({ genres }, { status: 200 });
    } catch (error) {
        console.error('Error during API request:', error);
        return NextResponse.json({ error: 'Failed to retrieve data' }, { status: 500 });
    }
}
