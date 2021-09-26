const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmailModel = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: Array,
    default: [],
  },
  cc: {
    type: Array,
    default: [],
  },
  bcc: {
    type: Array,
    default: [],
  },
  subject: {
    type: String,
    default: "",
  },
  body: {
    type: String,
    default: "",
  },
  files: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("drafts", EmailModel);
