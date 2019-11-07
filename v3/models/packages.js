var mongoose = require("mongoose");

//SCHEMA SETUP

var packageSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    spots: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Spot"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    tours: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tour"
        }
    ],
    hotels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


module.exports = mongoose.model("Package", packageSchema);