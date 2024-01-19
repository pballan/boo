const mongoose = require("../../database/mongo");
const commentModel = require("../../schemas/comment").commentModel;

const request = require("supertest");
let app = require("../../app");
let profile_id, post;

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

afterAll(() => {
  app.close();
});

describe("PUT /comment/like", () => {
  beforeAll(async () => {
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

    post = await request(app).post("/profile").send(profile);
    profile_id = post.body.id;

    await commentModel.deleteMany({});
  });

  afterAll(async () => {
    await commentModel.deleteMany({});
  });

  it("should like and unlike a comment without going less than 0", async () => {
    const res = await request(app).post("/comment").send({
      profile_id: profile_id,
      commentator_id: "1234",
      title: "alskjdaklsdasd ",
      mbti: "INTP",
      zodiac: "Pisces",
      enneagram: "9w8",
      text: "texto gegwgwegwege",
    });

    const comments_prelike = await request(app).get("/profile/" + profile_id + "/comments");
    expect(comments_prelike.body.payload[0].likes).toBe(0);
    expect(comments_prelike.body.payload[0]._id).toBeDefined();

    await request(app).put("/comment/" + res.body.comment_id + "/like");
    await request(app).put("/comment/" + res.body.comment_id + "/like");

    const comments_afterlike = await request(app).get("/profile/" + profile_id + "/comments");
    expect(comments_afterlike.body.payload[0].likes).toBe(2);

    await request(app).put("/comment/" + res.body.comment_id + "/unlike");
    await request(app).put("/comment/" + res.body.comment_id + "/unlike");
    await request(app).put("/comment/" + res.body.comment_id + "/unlike");

    const comments_afterunlike = await request(app).get("/profile/" + profile_id + "/comments");
    expect(comments_afterunlike.body.payload[0].likes).toBe(0);
  });

  it("should return comment sorted by likes and date", async () => {
    const comment_3 = await request(app).post("/comment").send({
      profile_id: profile_id,
      commentator_id: "1234",
      title: "alskjdaklsdasd ",
      mbti: "INTP",
      zodiac: "Pisces",
      enneagram: "9w8",
      text: "texto gegwgwegwege",
    });

    wait(1000);

    const comment_1 = await request(app).post("/comment").send({
      profile_id: profile_id,
      commentator_id: "1234",
      title: "alskjdaklsdasd ",
      mbti: "INTP",
      zodiac: "Pisces",
      enneagram: "9w8",
      text: "texto gegwgwegwege",
    });

    wait(1000);

    const comment_2 = await request(app).post("/comment").send({
      profile_id: profile_id,
      commentator_id: "1234",
      title: "alskjdaklsdasd ",
      mbti: "INTP",
      zodiac: "Pisces",
      enneagram: "9w8",
      text: "texto gegwgwegwege",
    });

    let comment_1_id = comment_1.body.comment_id;
    let comment_2_id = comment_2.body.comment_id;
    let comment_3_id = comment_3.body.comment_id;

    await request(app).put("/comment/" + comment_2_id + "/like");
    await request(app).put("/comment/" + comment_2_id + "/like");

    await request(app).put("/comment/" + comment_1_id + "/like");

    const comments_by_likes = await request(app).get("/profile/" + profile_id + "/comments");
    expect(comments_by_likes.body.payload[0].likes).toBe(2);
    expect(comments_by_likes.body.payload[1].likes).toBe(1);
    expect(comments_by_likes.body.payload[2].likes).toBe(0);

    const comments_by_date = await request(app)
      .get("/profile/" + profile_id + "/comments")
      .query({ sorting: "date" });

    expect(comments_by_date.body.payload[0]._id).toBe(comment_2_id);
    expect(comments_by_date.body.payload[1]._id).toBe(comment_1_id);
    expect(comments_by_date.body.payload[2]._id).toBe(comment_3_id);
  }, 15000);
});

describe("POST /comment", () => {
  beforeAll(async () => {
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

    post = await request(app).post("/profile").send(profile);
    profile_id = post.body.id;

    await commentModel.deleteMany({});
  });

  afterAll(async () => {
    await commentModel.deleteMany({});
  });
  it("should create a comment without voting", async () => {
    const res = await request(app).post("/comment").send({
      profile_id: profile_id,
      commentator_id: "1234",
      title: "alskjdaklsdasd ",
      text: "texto gegwgwegwege",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("comment created");
    expect(res.body.comment_id).toBeDefined();
  });

  it("should not create a comment without mandatory parameter", async () => {
    const res = await request(app).post("/comment").send({
      profile_id: profile_id,
      commentator_id: "1234",
      text: "texto gegwgwegwege",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("error in data validation, wrong params");
  });

  it("should create a comment with all votes", async () => {
    const res = await request(app).post("/comment").send({
      profile_id: profile_id,
      title: "title random ",
      commentator_id: "1234",
      mbti: "INTP",
      zodiac: "Pisces",
      enneagram: "9w8",
      text: "texto gegwgwegwege",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("comment created");
    expect(res.body.comment_id).toBeDefined();
  });

  it("should not create a comment with invalid vote", async () => {
    const res = await request(app).post("/comment").send({
      profile_id: profile_id,
      commentator_id: "1234",
      mbti: "INVALID_VOTE",
      zodiac: "Pisces",
      enneagram: "9w3",
      text: "texto gegwgwegwege",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("error in data validation, wrong params");
  });

  it("should not create a comment (profile does not exists)", async () => {
    const res = await request(app).post("/comment").send({
      profile_id: "000000000000000000000000",
      commentator_id: "1234",
      mbti: "INTP",
      zodiac: "Pisces",
      title: "alskjdaklsdasd ",
      text: "texto gegwgwegwege",
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("missing profile");
  });
});
