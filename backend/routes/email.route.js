const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const request = require("request");
const { cloudinary } = require("../config/cloudinary_setup");
const { MAILGUN_API, MAILGUN_DOMAIN } = require("../config/keys");

const mail_gun = require("mailgun-js")({
  apiKey: MAILGUN_API,
  domain: MAILGUN_DOMAIN,
});

router.post("/send", authentication, (req, response) => {
  console.log("/send - body - ", req.body);
  const { from, to, cc, bcc, subject, body, files } = req.body;
  let data = {
    from,
    to,
    subject,
    text: body,
    cc,
    bcc,
    attachment: files !== "" && files.map((url) => request(url)),
  };
  if (cc === "") delete data.cc;
  if (bcc === "") delete data.bcc;
  if (files === "") delete data.attachment;
  // console.log("/send - body - end - ", data);

  mail_gun.messages().send(data, (err, res) => {
    if (err) {
      response.json({ success: false, message: err });
      return;
    }
    console.log("/email/abc - mailgun - res - ", res);
    response.json({ success: true });
  });
});

router.post("/upload", authentication, (req, res) => {
  const { fileName, data } = req.body;
  cloudinary.v2.uploader.upload(
    data,
    {
      upload_preset: "ml_default",
      folder: "emailio",
      resource_type: "auto",
    },
    (error, result) => {
      if (error) {
        response.json({ success: false, fileName, message: error });
      }
      res.json({
        success: true,
        fileName,
        url: result.secure_url,
        publicId: result.public_id,
      });
    }
  );
});

router.post("/delete", authentication, (req, res) => {
  const { publicId, fileName } = req.body;
  cloudinary.v2.uploader.destroy(publicId, (err, result) => {
    if (err) {
      res.json({ success: false, message: err });
      return;
    }
    res.json({ success: true, fileName });
  });
});

module.exports = router;
