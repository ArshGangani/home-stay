const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// index route
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// new listing form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//specific list view
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!list) {
      req.flash("error", "Listing you requested for doesn't exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { list });
  })
);

// add listing to db
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "new listing created");
    res.redirect("/listings");
  })
);

// edit list form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
      req.flash("error", "Listing you requested for edit doesn't exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { list });
  })
);

// update list
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    let newlist = await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { runValidators: true }
    );
    req.flash("success", "listing updated");
    res.redirect(`/listings/${id}`);
  })
);

//delete list
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
