import mongoose, { connect } from "mongoose";
import { config } from "dotenv";
config();

const connectDB = async () => {
  try {
    const connectionInstance = mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    console.log(`\n✔︎ MONGO_DB Connected !!`);
  } catch (error) {
    console.log("MONGO_DB Connection Error", error);
    process.exit(1);
  }
}

export default connectDB