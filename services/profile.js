'use strict';

const model = require("../schemas/profile").profileModel

async function createProfile(params) {

    await model.create({
        "id": params.id,
        "name": params.name,
        "description": params.description,
        "mbti": params.mbti,
        "enneagram": params.enneagram,
        "variant": params.variant,
        "tritype": params.tritype,
        "socionics": params.socionics,
        "sloan": params.sloan,
        "psyche": params.psyche,
        "image": params.image,
        })
    
    return {status: "ok", code: "FOUND", message: "ok"}
}

async function findProfile(id){
    
    let profiles = await model.find({id: id})
    
    profiles.forEach((p)=> {
        console.log(p)
    })

    if(!profiles[0]) return {status: "error", code: "NOT_FOUND", message: "missing profile"}

    return {status: "ok", message: "ok", data: {profile: profiles[0]}}

}


module.exports = { createProfile, findProfile }