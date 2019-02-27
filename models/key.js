const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const KeySchema = new Schema({
  createdAt: { type: Date },
  mostRecentRequest: { type: Date },
  requests: [{ type: String}],
  key: { type: String }
});

module.exports = mongoose.model("Key", KeySchema);
