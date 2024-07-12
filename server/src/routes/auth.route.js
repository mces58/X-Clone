import express from 'express';

import { getMe, signin, signout, signup } from 'src/controllers/auth.controller';
import authentication from 'src/middlewares/authentication.middleware';

const router = express.Router();

router.route('/signup').post(signup);

router.route('/signin').post(signin);

router.route('/signout').get(signout);

router.route('/me').get(authentication, getMe);

export default router;
