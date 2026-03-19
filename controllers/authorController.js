import Author from "../models/Author.js";

// Get all authors
export const getAuthors = async (req, res) => {
  const authors = await Author.find();
  res.json(authors);
};

// Create author
export const createAuthor = async (req, res) => {
  try {
    const { name, bio } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Author name is required" });
    }

    const author = new Author({ name, bio });
    await author.save();

    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get author by ID
export const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.json(author);
  } catch (error) {
    res.status(400).json({ message: "Invalid author ID" });
  }
};

// Update author
export const updateAuthor = async (req, res) => {
  try {
    const { name } = req.body;

    // ✅ Optional validation
    if (name === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.json(updatedAuthor);
  } catch (error) {
    res.status(400).json({ message: "Invalid author ID" });
  }
};

// Delete author
export const deleteAuthor = async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);

    if (!deletedAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.json({ message: "Author deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid author ID" });
  }
};