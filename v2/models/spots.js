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
    hotels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel"
        }
    ],
    tours: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tour"
        }
    ],
    packages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Package"
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