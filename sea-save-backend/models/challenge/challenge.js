const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Challenge = new Schema({
    imageUrl: String,
    title: String,
    description: String
});

const newChallenge = mongoose.model("challenge", Challenge );
module.exports = newChallenge;
