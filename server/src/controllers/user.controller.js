const { default: User } = require('src/models/user.model');

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

    return res.status(200).json({
      success: true,
      message: 'User followed',
    });
  } catch (error) {
    console.log(error);
  }
};

export { getUserProfile, followUnFollowUser };
