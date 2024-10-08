const express = require("express");
const warpAsync = require("../util/warpAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user");


router.route("/signup")
    .get(userController.renderSignupForm)
    .post(warpAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local", {failureRedirect:"/login", failureFlash:true,}), warpAsync(userController.login));

router.get("/logout", userController.logout);

module.exports = router;