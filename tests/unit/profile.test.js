const profileService = require("../../services/profile");
const profileModel = require("../../schemas/profile");
let profile_id, post;

describe.only("createProfile", () => {
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

describe.only("findProfile", () => {
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
