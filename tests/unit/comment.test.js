const wait = require("../utils");
const request = require("supertest");
const profileModel = require("../../schemas/profile").profileModel;
const commentModel = require("../../schemas/comment").commentModel;
const commentService = require("../../services/comment");

describe("createComment", () => {
  let profile, profile_id;
  beforeAll(async () => {
    profile = {
      name: "A Martinez",
      description: "Adolph Larrue Martinez III.",
      mbti: "ISFJ",
      enneagram: "9w8",
      variant: "sp/so",
      tritype: 725,
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "https://soulverse.boo.world/images/1.png",
    };

    let result = await profileModel.create(profile);
    profile_id = result._id;
  });

  afterAll(async () => {
    await commentModel.deleteMany({});
    await profileModel.deleteMany({});
  });

  it("should create a comment without voting", async () => {
    const result = await commentService.createComment({
      profile_id: profile_id,
      commentator_id: "1234",
      title: "alskjdaklsdasd ",
      text: "texto gegwgwegwege",
    });

    expect(result.status).toBe(201);
    expect(result.message).toBe("comment created");
    expect(result.id).toBeDefined();
  });

  it("should not create a comment without mandatory parameter", async () => {
    let result, error;
    try {
      result = await commentService.createComment({
        profile_id: profile_id,
        commentator_id: "1234",
        text: "texto gegwgwegwege",
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it("should create a comment with all votes", async () => {
    let params = {
      profile_id: profile_id,
      title: "title random ",
      commentator_id: "1234",
      mbti: "INTP",
      zodiac: "Pisces",
      enneagram: "9w8",
      text: "texto gegwgwegwege",
    };
    const res = await commentService.createComment(params);

    expect(res.status).toBe(201);
    expect(res.message).toBe("comment created");
    expect(res.id).toBeDefined();
  });

  it("should not create a comment with invalid vote (mbti)", async () => {
    let result, error;
    let params = {
      profile_id: profile_id,
      title: "title random ",
      commentator_id: "1234",
      mbti: "INVALID_VOTE",
      zodiac: "Pisces",
      enneagram: "9w8",
      text: "texto gegwgwegwege",
    };
    try {
      result = await commentService.createComment(params);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it("should not create a comment with invalid vote (zodiac)", async () => {
    let result, error;
    let params = {
      profile_id: profile_id,
      title: "title random ",
      commentator_id: "1234",
      mbti: "INTP",
      zodiac: "invalid",
      enneagram: "9w8",
      text: "texto gegwgwegwege",
    };
    try {
      result = await commentService.createComment(params);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it("should not create a comment with invalid vote (enneagram)", async () => {
    let result, error;
    let params = {
      profile_id: profile_id,
      title: "title random ",
      commentator_id: "1234",
      mbti: "INTP",
      zodiac: "Pisces",
      enneagram: "invalid",
      text: "texto gegwgwegwege",
    };
    try {
      result = await commentService.createComment(params);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it("should not create a comment (profile does not exists)", async () => {
    let result, error;
    let params = {
      profile_id: "000000000000000000000000",
      commentator_id: "1234",
      title: "title random ",
      mbti: "INTP",
      zodiac: "Pisces",
      enneagram: "9w8",
      text: "texto gegwgwegwege",
    };
    try {
      result = await commentService.createComment(params);
    } catch (e) {
      error = e;
    }
    expect(error.status).toBe(404);
    expect(error.message).toBe("missing profile");
  });
});
