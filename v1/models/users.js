var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    madePackages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Packages"
        }
    ],
    cartPackages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Packages"
        }
    ],
    account:
        {
            bankName: String,
            holderName: String,
            number: String
        }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);