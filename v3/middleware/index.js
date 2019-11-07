//============
//Middleware
//===========

var Spot            = require("../models/spots"),
    Comment         = require("../models/comments"),
    User            = require("../models/users"),
    Package         = require("../models/packages");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

middlewareObj.checkSpotOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Spot.findById(req.params.id, function(err, foundSpot){
            if(err){
                res.redirect("back");
            } else {
                if(foundSpot.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkPackageOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Package.findById(req.params.id, function(err, foundPackage){
            if(err){
                res.redirect("back");
            } else {
                if(foundPackage.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }    
}

module.exports = middlewareObj;