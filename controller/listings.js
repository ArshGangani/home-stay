const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.viewListings = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!list) {
    req.flash("error", "Listing you requested for doesn't exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { list });
};

module.exports.addListings = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  newlisting.geometry = response.body.features[0].geometry;
  let savedListing = await newlisting.save();
  console.log(savedListing);
  req.flash("success", "new listing created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing you requested for edit doesn't exist");
    res.redirect("/listings");
  }

  let originalImage = list.image.url;
  originalImage = originalImage.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { list, originalImage });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let newlist = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true }
  );
  console.log(req.file);
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    newlist.image = { url, filename };
    await newlist.save();
  }
  req.flash("success", "listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "listing deleted");
  res.redirect("/listings");
};
