"use strict";

const express = require("express");
const router = express.Router();
const service = require("../services/profile");
const profileValidation = require("../utils/validators/profile");
const jsonValidator = require("jsonschema").Validator;

/*
const profiles = [
  {
    id: 1,
    name: "A Martinez",
    description: "Adolph Larrue Martinez III.",
    mbti: "ISFJ",
    enneagram: "9w3",
    variant: "sp/so",
    tritype: 725,
    socionics: "SEE",
    sloan: "RCOEN",
    psyche: "FEVL",
    image: "https://soulverse.boo.world/images/1.png",
  },
];
*/

router.get("/:id", async function (req, res, next) {
  try {
    let profile = await service.findProfile(req.params.id);
    res.render("profile_template", {
      profile: profile,
    });
  } catch (error) {
    res.send(error.status).send(error.message);
  }
});

router.get("/:id/comments", async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await service.findProfileComments(id);
    res.status(result.status).send(result);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

router.post("/", async function (req, res, next) {
  let validator = new jsonValidator();
  let v = validator.validate(req.body, profileValidation);

  if (!v.valid) {
    res.status(400).send("error in data validation");
    return;
  }

  try {
    let profile = req.body;
    let result = await service.createProfile(profile);
    res.send("profile created, profile_id: " + result.id);
  } catch (error) {
    res.status(error.status).send(error);
  }
  return;
});

module.exports = router;
