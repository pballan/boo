"use strict";

const profileModel = require("../schemas/profile").profileModel;
const commentModel = require("../schemas/comment").commentModel;

async function createProfile(params) {
  try {
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
      status: 201,
      message: "profile created",
      id: profile.id.toString(),
    };
  } catch (error) {
    throw error;
  }
}

async function findProfile(id) {
  try {
    let profiles = await profileModel.find({ _id: id });
    if (profiles[0]) profiles[0].__v = undefined;
    return profiles[0];
  } catch (error) {
    throw { status: 500, message: "error finding profile in database" };
  }
}

async function getComments(profile_id, sorting, filter) {
  // sorting = ['date', 'likes']
  // filter = ['mbti','zodiac','ennegram']
  try {
    let filtering;
    let query = { profile_id: profile_id };

    if (filter) {
      filtering = {};
      for (let k in filter) {
        query[filter[k]] = { $exists: true };
      }
    }

    let sort = { likes: "desc" };

    if (sorting == "date") {
      sort = { createdAt: -1 };
    }

    let comments = await commentModel.find(query).sort(sort);

    for (let c in comments) {
      comments[c].__v = undefined;
    }

    return { status: 200, message: "comments found", comments: comments };
  } catch (error) {
    throw { status: 500, message: "internal error" };
  }
}

module.exports = { createProfile, findProfile, getComments };
