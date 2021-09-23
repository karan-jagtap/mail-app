const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

router.post("/login", (req, res) => {
  console.log("/login - req - ", req.body);
  const { tokenId } = req.body;
  console.log("/login : ", tokenId);
  googleClient
    .verifyIdToken({
      idToken: tokenId,
    })
    .then((response) => {
      console.log("/login : verifyIdToken() - res - ", response);
      res.json({
        success: true,
        email: response.payload.email,
        name: response.payload.name,
        picture: response.payload.picture,
      });
    })
    .catch((err) => {
      console.log("/login : verifyIdToken() - err - ", err);
      res.json({ success: false });
    });
});

router.post("/verify_token", (req, res) => {
  const { tokenId } = req.body;
  googleClient
    .verifyIdToken({ idToken: tokenId })
    .then((response) => {
      console.log("karan - res", response);
      res.json({
        success: true,
        message_code: "token_valid",
        message_text: "Google token is valid!",
        email: response.payload.email,
        name: response.payload.name,
        picture: response.payload.picture,
      });
    })
    .catch((err) => {
      console.log("/verify_token - catch - err - ", err);
      res.json({
        success: false,
        message_code: "token_expired",
        message_text:
          "Your login session has expired. Please try signing in again.",
      });
    });
});

module.exports = router;
