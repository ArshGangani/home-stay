const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initdata = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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

const initDB = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "6678341340224f27cc11184f",
  }));
  await Listing.insertMany(initdata.data);
  console.log("Data is initialised");
};

initDB();
