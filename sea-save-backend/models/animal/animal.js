const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Animal = new Schema({
    name: String,
    mainThreat: String,
    description: String,
    imageUrl: String
});

const newAnimal = mongoose.model("animal", Animal);
module.exports = newAnimal;
