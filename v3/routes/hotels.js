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
//      HOTELS ROUTES
//=============================

//INDEX ROUTE - Show all hotels
router.get("/", function(req, res){
    Hotel.find({}, function(err, allHotels){
        res.render("hotels/index", {hotels: allHotels});
    });
});

//NEW ROUTE - Form for adding new hotel
router.get("/new", middleware.isLoggedIn, function(req, res){
    Spot.find({}, function(err, allSpots){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("hotels/new", {spots: allSpots});
        }
    });
});

//CREATE ROUTE - Add new hotel to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var spots = req.body.addedSpots;

    var newHotel = {
        name: name,
        image: image,
        description: description,
        author: author,
        spots: spots
    }

    Hotel.create(newHotel, function(err, addedHotel){
        if(err){
            console.log(err);
        } else {
            addedHotel.spots.forEach(function(spot){
                Spot.findById(spot._id, function(err, foundSpot){
                    if(err){
                        console.log(err);
                        res.redirect("back");
                    } else {
                        foundSpot.hotels.push(addedHotel);
                        foundSpot.save();
                    }
                });
            });
            res.redirect("/hotels");
        }
    });
});

//SHOW ROUTE - Display details of one hotel
router.get("/:hotel_id", function(req, res){
    Hotel.findById(req.params.hotel_id).populate("spots comments").exec(function(err, foundHotel){
        if(err){
            console.log(err);
        } else {
            res.render("hotels/show", {hotel: foundHotel});
        }
    });
});

//CART Route
router.post("/:id/cart", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, foundUser){
        if(err){
            console.log(err)
        } else {
            Hotel.findById(req.params.id, function(err, foundHotel){
                if(err){
                    console.log(err);
                } else {
                    foundUser.bookedHotels.push(foundHotel);
                    foundUser.save();
                }
            res.redirect("/hotels");
            });
        }
    });
});

module.exports = router;