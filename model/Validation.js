const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create validation schema
const ValidationSchema = new Schema({
  state: {
    type: String,
    required: true,
    default: "initialized"
  },
  landId: {
    type: String,
    required: true
  },
  landName: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  updateDate: {
    type: Date
  },
  districtCode: {
    type: String,
    required: true
  },
  countyCode: {
    type: String,
    required: true
  }
});

module.exports = Validation = mongoose.model("validations", ValidationSchema);
