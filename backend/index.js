const express = require("express");
require("dotenv").config();
const app = express();

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use("/api/", require("./routes/login.route"));
app.use("/email/", require("./routes/email.route"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("successfully listening on port ", PORT);
});
