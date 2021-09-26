const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

// connect to db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection to MongoDB successful.");
  })
  .catch((err) => {
    console.log("Error connecting database :: ", err);
  });

app.use("/api/", require("./routes/login.route"));
app.use("/email/", require("./routes/email.route"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("successfully listening on port ", PORT);
});
