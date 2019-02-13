const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DayData = require("../models/dayData");

const UserSchema = new Schema({
  username: { type: String },
  /* data : [{
    contribution: { type: String},
    date: { type: String }
  }], */
  numberOfRequests: {type: Number}
});

module.exports = mongoose.model("User", UserSchema);
