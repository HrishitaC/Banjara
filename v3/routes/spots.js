var express = require("express");
var router = express.Router({mergeParams: true});
var middleware = require("../middleware");
var Spot            = require("../models/spots"),
    Comment         = require("../models/comments"),
    Hotel           = require("../models/hotels"),
    Tour            = require("../models/tours"),
    User            = require("../models/users"),
    Packages        = require("../models/packages");

//==========================
//      SPOTS ROUTES
//==========================

//INDEX ROUTE - Display all spots
router.get("/", function(req, res){
    Spot.find({}, function(err, allSpots){
        if(err){
            console.log(err);
        } else{
            res.render("spots/index", {spots: allSpots});
        }
    });
});

//CREATE ROUTE - Add new spot to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var state = req.body.state;
    var country = req.body.country;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    var newSpot = {
        name: name,
        state: state,
        country: country,
        image: image,
        description: description,
        author: author
    }

    Spot.create(newSpot, function(err, addedSpot){
        if(err){
            console.log(err);
        } else {
            res.redirect("/spots");
        }
    });
});

//NEW ROUTE - Display the form to add new spot
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("spots/new")
});

//SEARCH Route
router.post("/search", function(req, res){
    Spot.find({"name": req.body.searchQuery}, function(err, foundSpots){
        if(foundSpots.length == 0){
            Spot.find({"state": req.body.searchQuery}, function(err, foundStates){
                if(foundStates.length == 0){
                    Spot.find({"country": req.body.searchQuery}, function(err, foundCountries){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("spots/index", {spots: foundCountries});
                        }
                    });
                } else {
                    res.render("spots/index", {spots: foundStates});
                }
            });
        } else {
            console.log(foundSpots);
            res.render("spots/index", {spots: foundSpots});
        }
    });
});

//SHOW ROUTE - Display details of one spot
router.get("/:id", function(req, res){
    Spot.findById(req.params.id).populate("comments tours hotels packages").exec(function(err, foundSpot){
        if(err){
            console.log(err);
        } else {
            res.render("spots/show", {spot: foundSpot});
        }
    });
});

//EDIT ROUTE - Display the edit form
router.get("/:id/edit", middleware.checkSpotOwnership, function(req, res){
    Spot.findById(req.params.id, function(err, foundSpot){
        res.render("spots/edit", {spot: foundSpot});
    });
});

//UPDATE ROUTE - Update the tourist spot
router.put("/:id", middleware.checkSpotOwnership, function(req, res){
    Spot.findByIdAndUpdate(req.params.id, req.body.spot, function(err, updated){
        if(err){
            console.log(err);
            res.redirect("/spots");
        } else {
            res.redirect("/spots/"+req.params.id);
        }
    });
});

//DESTROY ROUTE - Remove spot
router.delete("/:id", middleware.checkSpotOwnership, function(req, res){
    Spot.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/spots");
        } else {
            res.redirect("/spots");
        }
    });
});

module.exports = router;
