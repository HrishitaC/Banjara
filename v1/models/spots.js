var mongoose = require("mongoose");

//SCHEMA SETUP

var spotSchema = new mongoose.Schema({
    name: String,
    state: String,
    country: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});


module.exports = mongoose.model("Spot", spotSchema);