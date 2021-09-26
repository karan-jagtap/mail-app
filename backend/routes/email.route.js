const express = require("express");
const EmailModel = require("../models/Email.model");
const router = express.Router();
const authentication = require("../middleware/authentication");
const request = require("request");
const { cloudinary } = require("../config/cloudinary_setup");

const mail_gun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API,
  domain: process.env.MAILGUN_DOMAIN,
});

// send email
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

// upload file
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

// delete file
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

// save as draft
router.post("/save-as-draft", authentication, (req, response) => {
  console.log("/save-as-draft - body - ", req.body);
  const { drafId = "", from, to, cc, bcc, subject, body, files } = req.body;
  let data = {
    from,
    to,
    subject,
    body,
    cc,
    bcc,
    files,
  };

  if (drafId !== "") {
    EmailModel.findOneAndUpdate({ from, _id: drafId }, data, {
      upsert: true,
      new: true,
    })
      .then((res) => {
        console.log("/save-as-draft - mongo - res - ", res);
        response.json({ success: true, data: res });
      })
      .catch((err) => {
        console.log("/save-as-draft - mongo - err - ", err);
        response.json({ success: false, message_txt: err });
      });
  } else {
    const obj = new EmailModel(data);
    obj
      .save()
      .then((newRes) => {
        response.json({ success: true, data: newRes });
      })
      .catch((err) => {
        console.log("api/videos/ - catch - ", err);
        response.json({ success: false, message_txt: err });
      });
  }
});

// get drafts
router.post("/drafts", authentication, (req, response) => {
  console.log("/drafts - req.body - ", req.body);
  const { from } = req.body;
  EmailModel.find({ from: from }).then((res) => {
    console.log(res);
    response.json({ success: true, data: res });
  });
});

module.exports = router;
