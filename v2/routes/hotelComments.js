var express         = require("express");
var router          = express.Router({mergeParams: true});
var middleware      = require("../middleware");
var Spot            = require("../models/spots"),
    Comment         = require("../models/comments"),
    Tour            = require("../models/tours"),
    Hotel           = require("../models/hotels"),
    User            = require("../models/users"),
    Package        = require("../models/packages");

//=============================
//      COMMENTS ROUTES
//=============================

//NEW ROUTE - Form for adding new comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    Hotel.findById(req.params.id, function(err, foundHotel){
        if(err){
            console.log(err);
        } else {
            res.render("hotelComments/new", {hotel: foundHotel});
        }
    });
});

//CREATE ROUTE - Add a new comment 
router.post("/", middleware.isLoggedIn, function(req, res){
    Hotel.findById(req.params.id, function(err, foundHotel){
        if(err){
            console.log(err);
            res.redirect("/hotels");
        } else {
            Comment.create(req.body.comment, function(err, addedComment){
                if(err){
                    console.log(err);
                } else {
                    addedComment.author.id = req.user._id;
                    addedComment.author.username = req.user.username;
                    addedComment.save();
                    foundHotel.comments.push(addedComment);
                    foundHotel.save();
                    res.redirect("/hotels/" + foundHotel._id);
                }
            });
        }
    });
});

//EDIT ROUTE - Show edit form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Hotel.findById(req.params.id, function(err, foundHotel){
        if(err){
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment){
                res.render("hotelComments/edit", {hotel: foundHotel, comment: foundComment});
            });
        }
    });
});

//UPDATE ROUTE - Update comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updated){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/hotels/"+req.params.id);
        }
    });
});

//DESTROY ROUTE - Delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/hotels/"+req.params.id);
        }
    });
});

module.exports = router;