import Book from "../models/Book.js";
import Author from "../models/Author.js";
import Genre from "../models/Genre.js";

// Get all books
export const getBooks = async (req, res) => {
  const books = await Book.find().populate("author").populate("genre");
  res.json(books);
};

// Get book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("author")
      .populate("genre");

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(400).json({ message: "Invalid book ID" });
  }
};

// Create book
export const createBook = async (req, res) => {
  try {
    const { title, authorName, genreName, publishedYear } = req.body;

    if (!title || !authorName || !genreName) {
      return res.status(400).json({
        message: "Title, authorName, and genreName are required"
      });
    }

    const author = await Author.findOne({ name: authorName });
    const genre = await Genre.findOne({ name: genreName });

    if (!author || !genre) {
      return res.status(400).json({ message: "Author or Genre not found" });
    }

    const book = new Book({
      title,
      author: author._id,
      genre: genre._id,
      publishedYear
    });

    await book.save();

    const fullBook = await Book.findById(book._id)
      .populate("author")
      .populate("genre");

    res.status(200).json(fullBook);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update book
export const updateBook = async (req, res) => {
  try {
    const { title, authorName, genreName, publishedYear, publisher, edition, description } = req.body;

    const updateData = {};

    if (title) updateData.title = title;
    if (publishedYear) updateData.publishedYear = publishedYear;
    if (publisher) updateData.publisher = publisher;
    if (edition) updateData.edition = edition;
    if (description) updateData.description = description;

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

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: "Invalid book ID" });
  }
};

// Delete book
export const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid book ID" });
  }
};