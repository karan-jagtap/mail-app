const cloudinary = require("cloudinary");
const {
  CLOUDINARY_api_key,
  CLOUDINARY_api_secret,
  CLOUDINARY_cloud_name,
} = require("./keys");

// configure cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_cloud_name,
  api_key: CLOUDINARY_api_key,
  api_secret: CLOUDINARY_api_secret,
  secure: true,
});

module.exports = { cloudinary };
