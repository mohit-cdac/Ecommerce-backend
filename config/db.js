import mongoose from "mongoose";

let _db;
export const connectDB = async () => {
  try {
    let dbURL;
    if (process.env.NODE_ENV == "development") {
      dbURL = "mongodb://localhost:27017/proshop";
    } else {
      dbURL = `${process.env.MONGO_URI}`;
    }

    console.log("Database URL = ", dbURL);
    const conn = await mongoose.connect(dbURL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    _db = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    return _db;
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export const getDB = () => _db;
