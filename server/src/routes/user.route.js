import { Router } from 'express';

import { followUnFollowUser, getUserProfile } from 'src/controllers/user.controller';
import authentication from 'src/middlewares/authentication.middleware';

const router = Router();

router.route('/profile').get(authentication, getUserProfile);

router.route('/suggested').get(authentication);

router.route('/follow/:id').post(authentication, followUnFollowUser);

router.route('/update').put(authentication);

export default router;
