import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGOdB_URL);
    if (res) console.log("connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
