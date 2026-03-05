import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: String,
  birthYear: Number
});

export default mongoose.model("Author", authorSchema);