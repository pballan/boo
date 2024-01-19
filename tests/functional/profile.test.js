const mongoose = require("../../database/mongo");
const profileModel = require("../../schemas/profile").profileModel;

const request = require("supertest");
let app = require("../../app");

afterAll(() => {
  app.close();
});

describe("POST /profile", () => {
  beforeEach(async () => {
    await profileModel.deleteMany({});
  });

  it("should create a profile", async () => {
    const res = await request(app).post("/profile").send({
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
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("profile created");
  });

  it("should not create a profile (missing parameter)", async () => {
    const res = await request(app).post("/profile").send({
      description: "Adolph Larrue Martinez III.",
      mbti: "ISFJ",
      enneagram: "9w3",
      variant: "sp/so",
      tritype: 725,
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "https://soulverse.boo.world/images/1.png",
    });

    expect(res.statusCode).toBe(400);
  });
});

describe("GET /profile", () => {
  beforeEach(async () => {
    await profileModel.deleteMany({});
  });

  it("should return a profile", async () => {
    let profile = {
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
    };

    const post = await request(app).post("/profile").send(profile);
    const profile_id = post.body.id;
    profile._id = profile_id;
    const get = await request(app).get("/profile/" + profile_id);

    const response = {
      status: 200,
      payload: {
        profile: profile,
      },
      message: "profile found",
    };
    expect(get.statusCode).toBe(200);
    expect(get.body).toEqual(response);
  });

  it("should not return any profile", async () => {
    let profile = {
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
    };

    const post = await request(app).post("/profile").send(profile);
    const profile_id = "000000000000000000000000";
    const get = await request(app).get("/profile/" + profile_id);
    expect(get.statusCode).toBe(404);
    expect(get.body).toStrictEqual({
      status: 404,
      payload: {},
      message: "missing profile",
    });
  });
});

describe("GET /profile/:id/comments", () => {
  beforeEach(async () => {
    await profileModel.deleteMany({});
  });

  it("should get zero comments from profile", async () => {
    const profile = await request(app).post("/profile").send({
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
    });
    const profile_id = profile.body.id;
    profile._id = profile_id;

    const comments = await request(app).get("/profile/" + profile_id + "/comments");
    expect(expect.arrayContaining(comments.body.payload)).toEqual(expect.arrayContaining([]));
  });

  it("should get comments from profile", async () => {
    const profile = await request(app).post("/profile").send({
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
    });
    const profile_id = profile.body.id;
    profile._id = profile_id;

    let comment_1_data = {
      profile_id: profile_id,
      commentator_id: "1234",
      mbti: "INTP",
      zodiac: "Pisces",
      title: "title test ",
      text: "texto de test",
    };
    const comment_1 = await request(app).post("/comment").send(comment_1_data);

    let comment_2_data = {
      profile_id: profile_id,
      commentator_id: "1234",
      mbti: "INTP",
      zodiac: "Taurus",
      title: "title test taurus ",
      text: "texto de test",
    };
    const comment_2 = await request(app).post("/comment").send(comment_2_data);

    comment_2_data._id = comment_2.body.comment_id;
    comment_2_data.createdAt = comment_2.body.createdAt;
    comment_2_data.updatedAt = comment_2.body.updatedAt;
    comment_2_data.likes = 0;

    comment_1_data._id = comment_1.body.comment_id;
    comment_1_data.createdAt = comment_1.body.createdAt;
    comment_1_data.updatedAt = comment_1.body.updatedAt;
    comment_1_data.likes = 0;

    const comments = await request(app).get("/profile/" + profile_id + "/comments");
    expect(expect.arrayContaining(comments.body.payload)).toEqual(
      expect.arrayContaining([comment_1_data, comment_2_data])
    );
  });
});
