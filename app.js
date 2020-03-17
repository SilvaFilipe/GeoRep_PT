const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const passport = require("passport");

//Initialize app
const app = express();

//Middleware
//Form data middleware
app.use(bodyParser.json({ limit: "50mb" }));

//Json body middleware
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
  })
);

//Cors middleware
app.use(cors());

//Setting up static directory
app.use(express.static(path.join(__dirname, "public")));

//Use the passport middleware
app.use(passport.initialize());
//Bring in the Passport Strategy
require("./config/passport")(passport);

//Bring in the database configuration and connect with the database
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected successfully, db URI:  " + db);
  })
  .catch(err => {
    console.log("Unable to connect with the db, error: " + err);
  });

//Bring in the Users route
const users = require("./routes/api/users");
app.use("/api/users", users);

//Bring in the Lands route
const lands = require("./routes/api/lands");
app.use("/api/lands", lands);

//Bring in the Files route
const files = require("./routes/api/files");
app.use("/api/files", files);

//Bring in the Validations route
const validations = require("./routes/api/validations");
app.use("/api/validations", validations);

//Bring in the LandLikes route
const landLikes = require("./routes/api/landLikes");
app.use("/api/landLikes", landLikes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server started on PORT: " + PORT);
});
