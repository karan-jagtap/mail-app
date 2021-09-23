const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = (req, res, next) => {
  googleClient
    .verifyIdToken({ idToken: req.headers.authorization })
    .then((_) => {
      console.log("authentication - passed");
      next();
    })
    .catch((err) => {
      console.log("authentication - failed");
      res.json({
        success: false,
        message_code: "token_expired",
        message_text:
          "Your login session has expired. Please try signing in again.",
      });
    });
};
