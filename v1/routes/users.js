var express         = require("express");
var router          = express.Router({mergeParams: true});
var middleware      = require("../middleware");
var Spot            = require("../models/spots"),
    Comment         = require("../models/comments"),
    User            = require("../models/users"),
    Package        = require("../models/packages");

//=================
// USER ROUTES
//=================

//Show page
router.get("/:userID", function(req, res){
    User.findById(req.params.userID, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("/login");
        } else {
            res.render("users/show", {user: foundUser})
        }
    });
});

//DESTROY ROUTE - Delete user profile
router.delete("/:userID", function(req, res){
    User.findById(req.params.userID, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            Comment.deleteMany({"author.id": foundUser._id}, function(err){
                if(err){
                    console.log(err);
                }
            });
            Spot.deleteMany({"author.id": foundUser._id}, function(err){
                if(err){
                    console.log(err);
                }
            });
            Package.deleteMany({"author.id": foundUser._id}, function(err){
                if(err){
                    console.log(err);
                }
            });
        }
    });
    User.findByIdAndRemove(req.params.userID, function(err){
        if(err){
            console.log(err);
            res.redirect("/users/"+req.params.userID);
        } else {
            res.redirect("/spots");
        }
    });
});

module.exports = router;