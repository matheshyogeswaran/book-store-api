import Book from "../models/Book.js";
import Author from "../models/Author.js";
import Genre from "../models/Genre.js";

export const getBooks = async (req, res) => {
  const books = await Book.find().populate("author").populate("genre");
  res.json(books);
};

export const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id).populate("author").populate("genre");
  res.json(book);
};

export const createBook = async (req, res) => {
  const { title, authorName, genreName, publishedYear } = req.body;

  const author = await Author.findOne({ name: authorName });
  const genre = await Genre.findOne({ name: genreName });

  if (!author || !genre) return res.status(400).json({ message: "Author or Genre not found" });

  const book = new Book({
    title,
    author: author._id,
    genre: genre._id,
    publishedYear
  });

  await book.save();
  const fullBook = await Book.findById(book._id).populate("author").populate("genre");
  res.json(fullBook);
};

export const updateBook = async (req, res) => {
  try {
    const { title, authorName, genreName, publishedYear, publisher, edition, description } = req.body;

    const updateData = { title, publishedYear, publisher, edition, description };

    // If authorName or genreName is provided, get their IDs
    if (authorName) {
      const author = await Author.findOne({ name: authorName });
      if (!author) return res.status(400).json({ message: "Author not found" });
      updateData.author = author._id;
    }

    if (genreName) {
      const genre = await Genre.findOne({ name: genreName });
      if (!genre) return res.status(400).json({ message: "Genre not found" });
      updateData.genre = genre._id;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("author").populate("genre");

    if (!updatedBook) return res.status(404).json({ message: "Book not found" });

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};