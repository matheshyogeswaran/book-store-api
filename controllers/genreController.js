import Genre from "../models/Genre.js";


export const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).json({ message: "Genre not found" });
    res.json(genre);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const createGenre = async (req, res) => {
  try {
    const genre = new Genre(req.body);
    await genre.save();
    res.json(genre);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const updateGenre = async (req, res) => {
  try {
    const updatedGenre = await Genre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } 
    );

    if (!updatedGenre) return res.status(404).json({ message: "Genre not found" });

    res.json(updatedGenre);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteGenre = async (req, res) => {
  try {
    const deletedGenre = await Genre.findByIdAndDelete(req.params.id);

    if (!deletedGenre) return res.status(404).json({ message: "Genre not found" });

    res.json({ message: "Genre deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};