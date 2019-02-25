// Unused model for each day's data

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// day of week, # of contributions, actual date
const DayDataSchema = new Schema({
  date: { type: String },
  contributions: { type: Number },
});

module.exports = mongoose.model("DayData", DayDataSchema);
