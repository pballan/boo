let profileValidation = {
  id: "/Profile",
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    mbti: { type: "string" },
    variant: { type: "string" },
    tritype: { type: "integer" },
    socionics: { type: "string" },
    sloan: { type: "string" },
    psyche: { type: "string" },
    image: { type: "string", format: "uri" },
  },
  required: [
    "name",
    "description",
    "mbti",
    "enneagram",
    "variant",
    "tritype",
    "socionics",
    "sloan",
    "psyche",
    "image",
  ],
};

module.exports = profileValidation;
