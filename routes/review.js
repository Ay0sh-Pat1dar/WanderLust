const express = require("express");
const router = express.Router({mergeParams:true});
const WrapAsync = require("../util/warpAsync.js");
const ExpressError = require("../util/expressError.js");
const {listingSchema, reviewSchema} = require("../Schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");
const {saveRedirectUrl} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

function validateReview(req,res,next){
    // console.log(req.body);
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}


router.post("/", isLoggedIn, validateReview, WrapAsync(reviewController.createReview));

// review delete route
router.delete("/:Rid", isLoggedIn, isReviewAuthor, WrapAsync(reviewController.destroyReview));

module.exports = router;