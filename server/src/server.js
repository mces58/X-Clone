import userController from 'src/controller/user.controller';
import connectDB from 'src/db/connect.db';

connectDB();
userController();

console.log('Server-side code running');
