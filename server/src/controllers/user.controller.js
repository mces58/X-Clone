import bcrypt from 'bcryptjs';

import Notification from 'src/models/notification.model';
import User from 'src/models/user.model';

const getUserProfile = async (req, res) => {
  const { userName } = req.params;

  try {
    const user = await User.findOne({ userName }).select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User found',
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

const followUnFollowUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    const me = await User.findById(req.user._id);

    if (!user || !me) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        error: 'You cannot follow yourself',
      });
    }

    const isFollowing = me.following.includes(id);

    if (isFollowing) {
      await me.updateOne({ $pull: { following: id } });
      await user.updateOne({ $pull: { followers: req.user._id } });

      return res.status(200).json({
        success: true,
        message: 'User unfollowed',
      });
    }
    await me.updateOne({ $push: { following: id } });
    await user.updateOne({ $push: { followers: req.user._id } });

    const newNotification = new Notification({
      type: 'follow',
      from: req.user._id,
      to: id,
    });

    await newNotification.save();

    return res.status(200).json({
      success: true,
      message: 'User followed',
    });
  } catch (error) {
    console.log(error);
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select('following');

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUser = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUser = filteredUser.slice(0, 4);

    suggestedUser.forEach((user) => {
      user.password = null;
    });

    res.status(200).json({
      success: true,
      message: '',
      data: suggestedUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateProfile = async (req, res) => {
  const { fullName, userName, email, currentPassword, newPassword, bio, link } = req.body;
  const { avatar, cover } = req.body;

  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found', data: {} });
    }

    if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current password and new password',
        data: {},
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: 'Current password is incorrect', data: {} });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long',
          data: {},
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // upload avatar to cloudinary
    console.log(fullName, userName, email, bio, link, avatar, cover);
  } catch (error) {
    console.log(error);
  }
};

export { getUserProfile, followUnFollowUser, getSuggestedUsers, updateProfile };
