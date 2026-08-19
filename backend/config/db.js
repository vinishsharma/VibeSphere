import mongoose from "mongoose";
import { config } from "dotenv";
config();

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    console.log(`\n✔︎ MONGO_DB Connected !!`);
  } catch (error) {
    console.log("MONGO_DB Connection Error", error);
    throw error;
  }
}

export default connectDB
