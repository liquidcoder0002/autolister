import mongoose from "mongoose";

const connectDB = () => {
  const mongoUrl = process.env.DB_PATH;
  return new Promise((resolve, reject) => {
    mongoose.set('strictQuery', false);
    mongoose
      .connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => {
        console.log("DB Connection Successful");
        resolve();
      })
      .catch((err) => {
        console.log("DB Connection Failed");
        reject(err);
      });
  });
};

export default connectDB;