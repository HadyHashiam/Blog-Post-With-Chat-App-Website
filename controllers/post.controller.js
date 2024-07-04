// post.controller.js
const postmodel = require("../models/post.model");

// exports.createPost = async (req, res, next) => {
//   const { content } = req.body;
//   const userId = req.session.userId; // Assuming you have authentication middleware
//   try {
//     const newPost = new Post({
//       content: content,
//       author: userId
//     });
//     await newPost.save();
//     res.redirect("/profile2"); // Redirect to profile page after posting
//   } catch (error) {
//     console.error("Error creating post:", error);
//     res.redirect("/error");
//   }
// };

exports.createPost = (req, res, next) => {
  console.log("Request body:", req.body);
  const content = req.body.content;
  const userId = req.session.userId;

  if (!content || !userId) {
    console.error("Content or userId is missing");
    return res.redirect("/error");
  }

  postmodel.addNewPost({
    userId: userId,
    content: content
  }).then(() => {
    console.log("Post created successfully");
    res.redirect("/");
  }).catch(err => {
    console.error("Error creating post:", err);
    res.redirect("/error");
  });
};


