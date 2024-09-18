if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// console.log(process.env);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const WrapAsync = require("./util/warpAsync.js");
const ExpressError = require("./util/expressError.js");
const {listingSchema, reviewSchema} = require("./Schema.js");
const Review = require("./models/review.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", ()=>{
    console.log("ERRORin Mongo Session Store", error);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', engine);

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


async function main(){
    mongoose.connect(dbUrl);
}

main()
.then(()=>{console.log("connection successfull...")})
.catch(err=>{ console.log(err)});

app.listen(3000, ()=>{
    console.log("app is listening...");
});

app.get("/", (req,res)=>{
    res.redirect("/listings");
});

app.all("*", (req,res,next)=>{
    throw new ExpressError(404, "Page Not Found !");            // used throw because it is not a async function.
});

app.use((err,req,res,next)=>{
    let {status=500,message} = err;
    res.status(status);
    res.render("error.ejs", {message});
    // res.status(status).send(message);
});


