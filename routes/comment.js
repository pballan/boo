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
    res.status(400).send({ status: 400, message: "error in data validation, wrong params" });
    return;
  }

  try {
    let comment = req.body;
    let result = await service.createComment(comment);
    res.status(201).send({
      message: "comment created",
      comment_id: result.id,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  } catch (error) {
    res.status(error.status).send(error);
  }
  return;
});

router.put("/:comment_id/like", async function (req, res, next) {
  try {
    let comment_id = req.params.comment_id;
    let result = await service.updateCommentLike(comment_id);
    res.send(result);
  } catch (error) {
    res.status(error.status).send(error);
  }
  return;
});

router.put("/:comment_id/unlike", async function (req, res, next) {
  try {
    let comment_id = req.params.comment_id;
    let result = await service.updateCommentUnlike(comment_id);
    res.send(result);
  } catch (error) {
    res.status(error.status).send(error);
  }
  return;
});

module.exports = router;
