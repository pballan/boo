"use strict";

const commentModel = require("../schemas/comment").commentModel;
const profileModel = require("../schemas/profile").profileModel;
const ObjectId = require("mongoose").Types.ObjectId;

async function createComment(params) {
  try {
    let profile_id = params.profile_id;

    let comment_data = {
      profile_id: profile_id,
      text: params.text,
      commentator_id: params.commentator_id,
      title: params.title,
      likes: 0,
    };

    let id = new ObjectId(profile_id);

    let profile = await profileModel.find({ _id: id });

    if (profile.length < 1) throw { status: 404, message: "missing profile" };

    if (params.mbti) comment_data.mbti = params.mbti;
    if (params.enneagram) comment_data.enneagram = params.enneagram;
    if (params.zodiac) comment_data.zodiac = params.zodiac;

    let comment = await commentModel.create(comment_data);

    return {
      status: 201,
      message: "comment created",
      id: comment.id.toString(),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  } catch (error) {
    throw error;
  }
}

async function updateCommentUnlike(comment_id) {
  try {
    let query = {
      _id: comment_id,
      likes: { $gt: 0 },
    };

    await commentModel.find(query).updateOne({ $inc: { likes: -1 } });

    return {
      status: 200,
      message: "comment updated",
    };
  } catch (error) {}
}

async function updateCommentLike(comment_id) {
  try {
    let query = {
      _id: comment_id,
    };

    await commentModel.findOneAndUpdate(query, { $inc: { likes: 1 } });

    return {
      status: 200,
      message: "comment updated",
    };
  } catch (error) {
    throw { status: 500, message: "internal error" };
  }
}

module.exports = { createComment, updateCommentLike, updateCommentUnlike };
