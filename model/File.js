const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create file schema
const FileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String
  },
  dataUrl: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  relatedTable: {
    type: String
  },
  relatedId: {
    type: String
  },
  userId: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  }
});

module.exports = File = mongoose.model("files", FileSchema);
