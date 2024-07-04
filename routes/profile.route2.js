const router = require("express").Router();

const authGuard = require("./guards/auth.guard");
const profileController2 = require("../controllers/profile.controller2");



router.get("/", authGuard.isAuth, profileController2.getProfile);

router.get("/:id", authGuard.isAuth, profileController2.getProfile);





module.exports = router;
