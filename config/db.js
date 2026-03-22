import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const dbURI =
    process.env.NODE_ENV === "test"
      ? process.env.MONGO_TEST_URI
      : process.env.MONGO_URI;

  try {
    await mongoose.connect(dbURI);
    console.log(`MongoDB Connected: ${dbURI}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;