const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create landLike schema
const LandLikeSchema = new Schema({
  landId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = LandLike = mongoose.model("landLikes", LandLikeSchema);
