const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tracksSchema = new Schema({
  title: { type: String, required: true },
  artists: { type: String, required: true },
  userName: { type: String, required: true },
  userId: { type: String, required: true },
  trackId: { type: String, required: true, unique: true },
});

const Track = mongoose.model("Track", tracksSchema);

module.exports = Track;

