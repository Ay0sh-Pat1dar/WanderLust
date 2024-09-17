const express = require("express");
const router = express.Router();
const WrapAsync = require("../util/warpAsync.js");
const ExpressError = require("../util/expressError.js");
const {listingSchema, reviewSchema} = require("../Schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage});



function validateListings(req,res,next){
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}

router.get("/", WrapAsync(listingController.index));

router.route("/new")
    .get(isLoggedIn, listingController.renderNewForm)                                     //new Route
    .post(isLoggedIn, upload.single("listing[image]"), validateListings,  WrapAsync(listingController.createListing));                   //create listing route
    

router.route("/:id")
    .get(WrapAsync(listingController.showListings))                                      //show route
    .delete(isLoggedIn, WrapAsync(listingController.destroyListing));                    //Listing delete route

router.route("/:id/edit")
    .get(isLoggedIn, isOwner, WrapAsync(listingController.renderEditForm))          //update listing get route
    .patch( isLoggedIn, isOwner, upload.single("listing[image]"), validateListings, WrapAsync(listingController.updateListing));           //update listing route


module.exports = router;