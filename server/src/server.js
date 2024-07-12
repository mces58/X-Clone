import cookieParser from 'cookie-parser';
import express from 'express';

import connectMongo from 'src/db/mongo.db';
import authRoutes from 'src/routes/auth.route';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
  connectMongo();
});
