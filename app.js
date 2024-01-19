"use strict";

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const commentRoutes = require("./routes/comment");
const profileRoutes = require("./routes/profile");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// set the view engine to ejs
app.set("view engine", "ejs");

// routes
app.use("/profile", profileRoutes);
app.use("/comment", commentRoutes);

// start server
const server = app.listen(port);
console.log("Express started. Listening on %s", port);

module.exports = server;
