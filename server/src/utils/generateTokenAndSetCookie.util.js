import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const generateTokenAndSetCookie = (res, user) => {
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.cookie('token', token, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'development',
  });
};

export default generateTokenAndSetCookie;
