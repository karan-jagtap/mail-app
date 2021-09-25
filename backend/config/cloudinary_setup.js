const cloudinary = require("cloudinary");

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_cloud_name,
  api_key: process.env.CLOUDINARY_api_key,
  api_secret: process.env.CLOUDINARY_api_secret,
  secure: true,
});

module.exports = { cloudinary };
