'use strict';

const express = require('express');
const router = express.Router();
const service = require('../services/profile')


const profiles = [
  {
    "id": 1,
    "name": "A Martinez",
    "description": "Adolph Larrue Martinez III.",
    "mbti": "ISFJ",
    "enneagram": "9w3",
    "variant": "sp/so",
    "tritype": 725,
    "socionics": "SEE",
    "sloan": "RCOEN",
    "psyche": "FEVL",
    "image": "https://soulverse.boo.world/images/1.png",
  }
];

router.get('/profile/:id', async function(req, res, next) {
  let profile = service.findProfile(req.params.id)

  if (!profile){
    res.sendStatus(404)
  }

  res.render('profile_template', {
    profile: profile,
  });
});

router.post('/profile', async function(req, res, next) {
    await service.createProfile(profiles[0])
    res.send("todo en orden")
});



module.exports = router

