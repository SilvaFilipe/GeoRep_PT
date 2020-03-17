const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create land schema
const LandSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  coords: {
    type: String,
    required: true
  },
  centerCoords: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  districtCode: {
    type: String,
    required: true
  },
  countyCode: {
    type: String,
    required: true
  },
  createDate: {
    type: Date,
    required: true
  },
  updateDate: {
    type: Date
  },
  isValidated: {
    type: Boolean,
    default: false
  },
  requiringValidation: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  }
});

module.exports = Land = mongoose.model("lands", LandSchema);
