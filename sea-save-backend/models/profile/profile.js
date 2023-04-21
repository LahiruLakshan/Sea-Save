const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Profile = new Schema({
    name: String,
    email: String,
    contactNo: String,
    password: String,
    type: String,
    adminApproval: Boolean
});

const profile = mongoose.model("profile", Profile );
module.exports = profile;
