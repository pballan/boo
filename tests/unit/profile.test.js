const profileService = require("../../services/profile");
const profileModel = require("../../schemas/profile").profileModel;
const commentModel = require("../../schemas/comment").commentModel;
const wait = require("../utils");

describe("createProfile", () => {
  it("should properly create a profile", async () => {
    let params = {
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

    let result = await profileService.createProfile(params);

    expect(result.status).toBe(201);
    expect(result.message).toBe("profile created");
  });

  it("should throw error due to missing params", async () => {
    let params = {
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

    let error;

    try {
      let profile = await profileService.createProfile(params);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });
});

describe("findProfile", () => {
  let profile;
  beforeAll(async () => {
    profile = {
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

    let result = await profileService.createProfile(profile);
    profile._id = result.id;
  });

  afterAll(async () => {});

  it("should properly find a profile", async () => {
    let result = await profileService.findProfile(profile._id);

    result = result.toJSON();
    result._id = result._id.toString();

    expect(result).toStrictEqual(profile);
  });

  it("should not find a profile", async () => {
    let result = await profileService.findProfile("000000000000000000000000");

    expect(result).not.toBeDefined();
  });
});

describe("getComments", () => {
  let comment_1, comment_2, comment_3, profile, comment_data_1, comment_data_2, comment_data_3;
  beforeAll(async () => {
    profile = {
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
    let result = await profileModel.create(profile);

    profile._id = result.id;
    comment_data_1 = {
      profile_id: profile._id,
      title: "title random ",
      commentator_id: "1234",
      mbti: "INTP",
      zodiac: "Pisces",
      enneagram: "9w8",
      text: "texto gegwgwegwege",
    };

    comment_1 = await commentModel.create(comment_data_1);
    comment_data_1._id = comment_1._id;

    comment_data_2 = {
      profile_id: profile._id,
      title: "title for anotther comment ",
      commentator_id: "1234",
      mbti: "ISTP",
      enneagram: "1w2",
      text: "texto test",
    };
    wait(500);
    comment_2 = await commentModel.create(comment_data_2);
    comment_data_2._id = comment_2._id;

    comment_data_3 = {
      profile_id: profile._id,
      title: "title for anotther comment  3",
      commentator_id: "1234",
      mbti: "ESFJ",
      zodiac: "Scorpio",
      enneagram: "6w7",
      text: "texto test 3",
    };

    wait(1000);
    comment_3 = await commentModel.create(comment_data_3);
    comment_data_3._id = comment_3._id;
  });

  afterAll(async () => {});

  it("should properly get comments from profile", async () => {
    let result = await profileService.getComments(profile._id);
    expect(result.comments.length).toBe(3);
    expect(result.status).toBe(200);
    expect(result.message).toBe("comments found");
  });

  it("should properly get comments from profile sorted by likes", async () => {
    let query = {
      _id: comment_data_2._id,
    };
    await commentModel.findOneAndUpdate(query, { $inc: { likes: 2 } });

    query = {
      _id: comment_data_3._id,
    };
    await commentModel.findOneAndUpdate(query, { $inc: { likes: 1 } });

    let result = await profileService.getComments(profile._id);
    expect(result.comments[0]._id).toStrictEqual(comment_data_2._id);
    expect(result.comments[1]._id).toStrictEqual(comment_data_3._id);
    expect(result.comments[2]._id).toStrictEqual(comment_data_1._id);
  });

  it("should properly get comments from profile sorted by date", async () => {
    let result = await profileService.getComments(profile._id, "date");
    expect(result.comments[0]._id).toStrictEqual(comment_data_3._id);
    expect(result.comments[1]._id).toStrictEqual(comment_data_2._id);
    expect(result.comments[2]._id).toStrictEqual(comment_data_1._id);
  });

  it("should properly get comments from profile filtered by zodiac", async () => {
    let result = await profileService.getComments(profile._id, "date", ["zodiac"]);
    let comments_data = [comment_data_3._id, comment_data_1._id];
    expect(comments_data).toContainEqual(result.comments[0]._id);
    expect(comments_data).toContainEqual(result.comments[1]._id);
    expect(result.comments.length).toBe(2);
  });
});
