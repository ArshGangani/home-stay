const Listing = require("../models/listing")
const Review = require("../models/review")

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  let listingreview = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listingreview.reviews.push(newReview);

  await newReview.save();
  await listingreview.save();
  req.flash("success", "new review created");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview = async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted");
    res.redirect(`/listings/${id}`);
  }