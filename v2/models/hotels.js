var mongoose = require("mongoose");

var hotelSchema = {
    name: String,
    description: String,
    image: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    spots: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Spot"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}

module.exports = mongoose.model("Hotel", hotelSchema);