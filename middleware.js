const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = async (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must login first");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the Owner of this listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
};

module.exports.isReviewAuthor = async (req,res,next)=>{
    let { id, Rid } = req.params;
    let review = await Review.findById(Rid);
    if(! review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the Author of this review");
        return res.redirect(`/listings/${id}`)
    }
    next();
};