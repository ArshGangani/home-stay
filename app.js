const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("index");
});

// index route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// new listing form
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//specific list view
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  res.render("listings/show.ejs", { list });
});

// add listing to db
app.post("/listings", async (req, res) => {
  const newlisting = new Listing(req.body.listing);
  await newlisting.save();
  res.redirect("/listings");
});

// edit list form
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  res.render("listings/edit.ejs", { list });
});

// update list
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  console.log(req.body.listing);
  let newlist = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true }
  );
  console.log("after update:- ");
  console.log(newlist);
  res.redirect(`/listings/${id}`);
});

//delete list
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.listen(8080, () => {
  console.log("server is listening at port 8080");
});
