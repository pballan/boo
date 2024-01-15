"use strict";

const mongodb = require("../database/mongo");

let profileSchema = new mongodb.Schema({
  name: String,
  description: String,
  mbti: String,
  enneagram: String,
  variant: String,
  tritype: Number,
  socionics: String,
  sloan: String,
  psyche: String,
  image: String,
});

const Profile = mongodb.model("Profile", profileSchema);

module.exports = { profileModel: Profile };
