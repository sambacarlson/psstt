import mongoose from "mongoose";
const URI = process.env.DATABASE_CONNECTION_STRING;

export default function DB() {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => {
        if (res) {
          console.log("Database connected!");
          resolve("Database connected!");
        }
      })
      .catch((err) => {
        console.log(err);
        reject("DB_ERROR");
      });
  });
}
