import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB, getDB } from "./config/db.js";
import path from "path";
import cors from "cors";
import colors from "colors";
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express();
const __dirname = path.resolve();

dotenv.config();
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());


// routes
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)


const PORT = process.env.PORT || 5000;


// Connecting to database and Starting the server
try {
  let db = await connectDB();
  if (db) {
    app.listen(
      PORT,
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      )
    );
  }
} catch (error) {
  console.log(error);
}
