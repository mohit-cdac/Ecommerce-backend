import mongoose from 'mongoose'

let _db;
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    _db = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
    return _db;
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold)
    process.exit(1)
  }
}


export const getDB = () => _db

