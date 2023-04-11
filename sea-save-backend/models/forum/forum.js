const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Forum = new Schema({
    profileId: String,
    challengeId: String,
    solution: String
});

const forum = mongoose.model("forum", Forum );
module.exports = forum;
