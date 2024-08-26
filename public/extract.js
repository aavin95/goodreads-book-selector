const fs = require('fs');
const path = require('path');

// Path to your input JSON file
const inputFilePath = path.join(__dirname, 'genres_over_time.json');

// Path to your output JSON file
const outputFilePath = path.join(__dirname, 'unique_genres.json');

// Read the input JSON file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    try {
        const books = JSON.parse(data);
        const allGenres = new Set();

        // Loop through each book entry
        books.forEach(book => {
            if (Array.isArray(book.genres)) {
                book.genres.forEach(genre => {
                    allGenres.add(genre);
                });
            }
        });

        // Convert the Set to an array and sort it
        const uniqueGenres = Array.from(allGenres).sort();

        // Write the unique genres to a new JSON file
        fs.writeFile(outputFilePath, JSON.stringify(uniqueGenres, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing the file:', err);
                return;
            }
            console.log('Unique genres have been saved to', outputFilePath);
        });
    } catch (error) {
        console.error('Error parsing the JSON:', error);
    }
});
