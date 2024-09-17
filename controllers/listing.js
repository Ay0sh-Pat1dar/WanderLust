const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"},}).populate("owner");
    // console.log(listing);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {listing});
};

module.exports.createListing = async (req,res)=>{
    // if(!req.body){
    //     throw new ExpressError(400, "Send Valid Data");
    // }

    // let result = listingSchema.validate(req.body);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }

    // let {title, description, price, location, country, image} = req.body;
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
        
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = await new Listing({...req.body.listing,
    });
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = response.body.features[0].geometry;
    
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalListingImage = listing.image.url;
    originalListingImage = originalListingImage.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", {listing, originalListingImage});
};

module.exports.updateListing = async(req, res)=>{
    let {id} = req.params;
    // console.log(listing);
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, {runValidators:true, new:true});
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted");

    res.redirect("/listings");
};