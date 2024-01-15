echo $(curl -X POST -H 'Content-Type: application/json' -v -d '{"name": "A Martinez", "description": "Adolph Larrue Martinez III.", "mbti": "ISFJ",
    "enneagram": "9w3",
    "variant": "sp/so",
    "tritype": 725,
    "socionics": "SEE",
    "sloan": "RCOEN",
    "psyche": "FEVL",
    "image": "https://soulverse.boo.world/images/1.png"}' localhost:3000/profile )