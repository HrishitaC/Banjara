var express         = require("express");
var router          = express.Router({mergeParams: true});
var middleware      = require("../middleware");
var Spot            = require("../models/spots"),
    Comment         = require("../models/comments"),
    Hotel           = require("../models/hotels"),
    Tour            = require("../models/tours"),
    User            = require("../models/users"),
    Packages        = require("../models/packages");

//=============================
//      TOURS ROUTES
//=============================

//INDEX ROUTE - Show all tours
router.get("/", function(req, res){
    Tour.find({}, function(err, allTours){
        res.render("tours/index", {tours: allTours});
    });
});

//NEW ROUTE - Form for adding new tour agency
router.get("/new", middleware.isLoggedIn, function(req, res){
    Spot.find({}, function(err, allSpots){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("tours/new", {spots: allSpots});
        }
    });
});

//CREATE ROUTE - Add new tour to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var spots = req.body.addedSpots;

    var newTour = {
        name: name,
        image: image,
        description: description,
        author: author,
        spots: spots
    }

    Tour.create(newTour, function(err, addedTour){
        if(err){
            console.log(err);
        } else {
            addedTour.spots.forEach(function(spot){
                Spot.findById(spot._id, function(err, foundSpot){
                    if(err){
                        console.log(err);
                        res.redirect("back");
                    } else {
                        foundSpot.tours.push(addedTour);
                        foundSpot.save();
                    }
                });
            });
            res.redirect("/tours");
        }
    });
});

//SHOW ROUTE - Display details of one tour
router.get("/:tour_id", function(req, res){
    Tour.findById(req.params.tour_id).populate("spots comments").exec(function(err, foundTour){
        if(err){
            console.log(err);
        } else {
            res.render("tours/show", {tour: foundTour});
        }
    });
});

module.exports = router;