'use strict';

const mongoose = require('mongoose')
  
let profileSchema = new mongoose.Schema({
    id: {type: Number, index: true},
    name: String,
    description: String,
    mbti: String,
    enneagram: String,
    variant: String,
    tritype: Number,
    socionics: String,
    sloan: String,
    psyche: String,
    image: String
})

const Profile = mongoose.model('Profile', profileSchema)

module.exports = {profileModel: Profile}