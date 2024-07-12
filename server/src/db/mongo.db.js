import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.log('MongoDB connection error', error);
    process.exit(1);
  }
};

export default connectMongo;
