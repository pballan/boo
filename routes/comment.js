"use strict";

const express = require("express");
const router = express.Router();
const service = require("../services/comment");
const commentValidation = require("../utils/validators/comment");
const jsonValidator = require("jsonschema").Validator;

router.post("/", async function (req, res, next) {
  let validator = new jsonValidator();
  let v = validator.validate(req.body, commentValidation);

  if (!v.valid) {
    res.status(400).send("error in data validation, wrong params");
    return;
  }

  try {
    let comment = req.body;
    let result = await service.createComment(comment);
    res.send("comment created, comment_id: " + result.id);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let comment = await service.findComment(id);
    res.send(comment);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

module.exports = router;
