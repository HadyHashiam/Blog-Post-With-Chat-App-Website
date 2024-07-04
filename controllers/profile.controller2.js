
const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
/**
 * user enter his profile
 * friends
 *      user1 is in user2 friends
 * user1 send friend request to user2
 *      user1 is in user2 friendRequests
 * user1 recieved friend request from user2
 *      user1 is in user2 sent requests
 */



exports.getProfile = async (req, res) => {
  let id = req.params.id || req.session.userId;
  try {
    const userData = await userModel.getUserData(id);
    const posts = await postModel.getPostsByUserId(id);

    res.render("profile2", {
      pageTitle: userData.username,
      isUser: req.session.userId,
      friendRequests: req.friendRequests,
      username: userData.username,
      posts: posts,
      myId: req.session.userId,
      friendId: userData._id,
      userImage: userData.image,
      messages: userData.messages,
      isOwner: id === req.session.userId,
      friends: userData.friends,
      sentRequests: userData.sentRequests,
      friendRequests: userData.friendRequests,
      isFriends: userData.friends.some(friend => friend.id === req.session.userId),
      isRequestSent: userData.friendRequests.some(friend => friend.id === req.session.userId),
      isRequestReceived: userData.sentRequests.some(friend => friend.id === req.session.userId)
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.redirect("/error");
  }
};
