"use strict";

const model = require("../schemas/comment").commentModel;

async function createComment(params) {
  let comment_data = {
    profile_id: params.profile_id,
    commentator_id: params.commentator_id,
    title: params.title,
    likes: 0,
  };

  if (params.mbti) comment_data.mbti = params.mbti;
  if (params.enneagram) comment_data.enneagram = params.enneagram;
  if (params.zodiac) comment_data.zodiac = params.zodiac;

  let comment = await model.create(comment_data);

  return {
    status: 200,
    message: "comment created",
    id: comment.id.toString(),
  };
}

async function findComment(profile_id, filter, sorting) {
  let comments = await model.find({ profile_id: profile_id });

  if (!profiles[0]) throw { status: 404, message: "missing profile" };

  return { status: 200, message: "comments found", data: { profile: profiles[0] } };
}

module.exports = { createComment, findComment };
