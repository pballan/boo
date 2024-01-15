echo $(curl -X POST -H 'Content-Type: application/json' -v \
-d '{"profile_id": "123", "commentator_id": "1234", "mbti": "ISFP",
    "enneagram": "9w8",
    "zodiac": "Aries",
    "title": "aguante bocaaaa"}' localhost:3000/comment )