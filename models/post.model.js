const mongoose = require("mongoose");
const DB_URL = process.env.MONGODB_URI

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  timestamp: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", postSchema);

exports.getPostsByUserId = async userId => {
  let connection;
  try {
    connection = await mongoose.connect(DB_URL);
    const posts = await Post.find({ userId }).sort({ timestamp: -1 }).exec();
    return posts;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getPostsByUserAndFriends = async (userId, friendsIds) => {
  let connection;
  try {
    connection = await mongoose.connect(DB_URL);
    const posts = await Post.find({
      userId: { $in: [userId, ...friendsIds] }
    }).sort({ timestamp: -1 }).exec();
    return posts;
  } catch (error) {
    throw new Error(error);
  }
};

exports.addNewPost = async data => {
  let connection;
  try {
    connection = await mongoose.connect(DB_URL);
    let newPost = new Post(data);
    return await newPost.save();
  } catch (error) {
    throw new Error(error);
  }
};
