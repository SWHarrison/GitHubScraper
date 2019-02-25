const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DayData = require("../models/dayData");

const UserSchema = new Schema({
  firstRequest: { type: Date },
  mostRecentRequest: { type: Date },
  username: { type: String },
  /* data : [{
    contribution: { type: String},
    date: { type: String }
  }], */
  numberOfRequests: {type: Number}
});

// Code block to update time requests, moved to controllers
/* UserSchema.pre("save", function(next) {
  // SET firstRequest AND mostRecentRequest
  console.log("this ran the userschema")
  const now = new Date();
  if (!this.firstRequest) {
    console.log("this ran the inner if")
    console.log(this)
    this.firstRequest = now;
    this.mostRecentRequest = now;
  } else if(now.getTime() - this.mostRecentRequest.getTime() > 5000){
    this.mostRecentRequest = now;
  }
  next();
}); */

module.exports = mongoose.model("User", UserSchema);
