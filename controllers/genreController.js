import Genre from "../models/Genre.js";

// Get all genres
export const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get genre by ID
export const getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);

    if (!genre) {
      return res.status(404).json({ message: "Genre not found" });
    }

    res.json(genre);
  } catch (error) {
    res.status(400).json({ message: "Invalid genre ID" });
  }
};

// Create genre
export const createGenre = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Genre name is required" });
    }

    const genre = new Genre({ name, description });
    await genre.save();

    res.status(200).json(genre);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update genre
export const updateGenre = async (req, res) => {
  try {
    const { name } = req.body;

    if (name === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    const updatedGenre = await Genre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedGenre) {
      return res.status(404).json({ message: "Genre not found" });
    }

    res.json(updatedGenre);
  } catch (error) {
    res.status(400).json({ message: "Invalid genre ID" });
  }
};

// Delete genre
export const deleteGenre = async (req, res) => {
  try {
    const deletedGenre = await Genre.findByIdAndDelete(req.params.id);

    if (!deletedGenre) {
      return res.status(404).json({ message: "Genre not found" });
    }

    res.json({ message: "Genre deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid genre ID" });
  }
};