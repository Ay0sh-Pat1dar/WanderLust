const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main()
.then(()=>{console.log("connection successfull...")})
.catch(err=>{ console.log(err)});

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"66deaedf8cb2bbc5972ba99f"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();