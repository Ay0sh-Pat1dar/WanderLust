const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req,res)=>{
    // let {rating, comments} = req.body;
    console.log(req.body);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    newReview.save();
    listing.save();

    req.flash("success", "Review Added");

    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req,res)=>{
    await Listing.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.Rid}});
    await Review.findByIdAndDelete(req.params.Rid);

    req.flash("success", "Review Deleted");
    
    res.redirect(`/listings/${req.params.id}`);
};