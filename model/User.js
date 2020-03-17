const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create user schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: "regular",
    required: true
  },
  managingDistrict: {
    type: String
  },
  managingCounty: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  birthDate: {
    type: Date
  }
});

module.exports = User = mongoose.model("users", UserSchema);
