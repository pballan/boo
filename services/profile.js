"use strict";

const profileModel = require("../schemas/profile").profileModel;
const commentModel = require("../schemas/comment").commentModel;

async function createProfile(params) {
  let profile = await profileModel.create({
    name: params.name,
    description: params.description,
    mbti: params.mbti,
    enneagram: params.enneagram,
    variant: params.variant,
    tritype: params.tritype,
    socionics: params.socionics,
    sloan: params.sloan,
    psyche: params.psyche,
    image: params.image,
  });

  return {
    status: 200,
    message: "profile created",
    id: profile.id.toString(),
  };
}

async function findProfile(id) {
  try {
    let profiles = await profileModel.find({ id: id });
    if (!profiles[0]) throw { status: 404, message: "missing profile" };
    return { status: 200, message: "profile found", data: { profile: profiles[0] } };
  } catch (error) {
    throw { status: 500, message: "error finding profile in database" };
  }
}

async function findProfileComments(id) {
  try {
    let profiles = await profileModel.find({ id: id });
    if (!profiles[0]) return { status: 404, message: "profile does not exist" };

    let comments = await commentModel.find({ id: id });

    return { status: 200, message: "comments found", data: comments };
  } catch (error) {
    throw { status: 500, message: "error finding profile in database" };
  }
}

module.exports = { createProfile, findProfile, findProfileComments };
