"use strict";

const mongodb = require("../database/mongo");

let commentSchema = new mongodb.Schema(
  {
    profile_id: { type: String, index: true },
    commentator_id: {
      type: String,
    },
    title: String,
    text: String,
    mbti: {
      type: String,
      enum: [
        "INFP",
        "INFJ",
        "ENFP",
        "INTJ",
        "INTP",
        "ENTP",
        "ENTJ",
        "ISFP",
        "ESFP",
        "ESFJ",
        "ISTP",
        "ISTJ",
        "ESTP",
        "ESTJ",
      ],
    },
    enneagram: {
      type: String,
      enum: [
        "1w2",
        "2w3",
        "3w2",
        "3w4",
        "4w3",
        "4w5",
        "5w4",
        "5w6",
        "6w5",
        "6w7",
        "7w6",
        "7w8",
        "8w7",
        "8w9",
        "9w8",
        "9w1",
      ],
    },
    zodiac: {
      type: String,
      enum: [
        "Aries",
        "Taurus",
        "Gemini",
        "Cancer",
        "Leo",
        "Virgo",
        "Libra",
        "Scorpio",
        "Sagittarius",
        "Capricorn",
        "Aquarius",
        "Pisces",
      ],
    },
    likes: { type: Number, min: 0 },
  },
  { timestamps: true }
);

const Comment = mongodb.model("Comment", commentSchema);

module.exports = { commentModel: Comment };
