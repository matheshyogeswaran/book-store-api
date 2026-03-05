// seeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "./models/Book.js";
import Author from "./models/Author.js";
import Genre from "./models/Genre.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const authors = [
  { name: "J.K. Rowling", bio: "Author of Harry Potter", birthYear: 1965 },
  { name: "George R.R. Martin", bio: "Author of Game of Thrones", birthYear: 1948 },
  { name: "J.R.R. Tolkien", bio: "Author of Lord of the Rings", birthYear: 1892 },
  { name: "Agatha Christie", bio: "Famous mystery author", birthYear: 1890 },
];

const genres = [
  { name: "Fantasy", description: "Fantasy books" },
  { name: "Mystery", description: "Mystery books" },
  { name: "Adventure", description: "Adventure books" },
];

const books = [
  { title: "Harry Potter 1", authorName: "J.K. Rowling", genreName: "Fantasy", publishedYear: 1997 },
  { title: "Harry Potter 2", authorName: "J.K. Rowling", genreName: "Fantasy", publishedYear: 1998 },
  { title: "Game of Thrones", authorName: "George R.R. Martin", genreName: "Fantasy", publishedYear: 1996 },
  { title: "Lord of the Rings", authorName: "J.R.R. Tolkien", genreName: "Adventure", publishedYear: 1954 },
  { title: "Murder on the Orient Express", authorName: "Agatha Christie", genreName: "Mystery", publishedYear: 1934 },
];

const seedData = async () => {
  await connectDB();


  await Book.deleteMany({});
  await Author.deleteMany({});
  await Genre.deleteMany({});


  const insertedAuthors = await Author.insertMany(authors);
  const insertedGenres = await Genre.insertMany(genres);


  const booksWithIds = books.map(book => {
    const author = insertedAuthors.find(a => a.name === book.authorName);
    const genre = insertedGenres.find(g => g.name === book.genreName);
    return {
      title: book.title,
      author: author._id,
      genre: genre._id,
      publishedYear: book.publishedYear,
    };
  });

  await Book.insertMany(booksWithIds);
  console.log("Seeded 5 books, 4 authors, 3 genres successfully!");
  process.exit();
};

seedData();