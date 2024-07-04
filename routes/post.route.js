// post.route.js

const router = require("express").Router();
const postController = require("../controllers/post.controller");

router.post("/create", postController.createPost);

module.exports = router;
