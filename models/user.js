const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DayData = require("../models/dayData");

const UserSchema = new Schema({
  username: { type: String, required: true },
  posts : [{ type: Schema.Types.ObjectId, ref: "DayData" }]
});
