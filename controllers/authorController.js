import Author from "../models/Author.js";

export const getAuthors = async (req, res) => {
  const authors = await Author.find();
  res.json(authors);
};

export const createAuthor = async (req, res) => {
  const author = new Author(req.body);
  await author.save();
  res.json(author);
};

export const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.json(author);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;
    const updateData = req.body;

    // Find the author and update
    const updatedAuthor = await Author.findByIdAndUpdate(
      authorId,
      updateData,
      { new: true } // return the updated document
    );

    if (!updatedAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.json(updatedAuthor);
  } catch (error) {
    console.error("Error updating author:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;

    // Find and delete the author
    const deletedAuthor = await Author.findByIdAndDelete(authorId);

    if (!deletedAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.json({ message: "Author deleted successfully" });
  } catch (error) {
    console.error("Error deleting author:", error);
    res.status(500).json({ message: "Server error" });
  }
};