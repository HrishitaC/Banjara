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

// //EDIT ROUTE - Show edit form
// router.get("/:hotel_id/edit", middleware.checkHotelOwnership, function(req, res){
//     Spot.findById(req.params.id, function(err, foundSpot){
//         if(err){
//             res.redirect("back");
//         } else {
//             Hotel.findById(req.params.comment_id, function(err, foundHotel){
//                 res.render("hotels/edit", {spot: foundSpot, hotel: foundHotel});
//             });
//         }
//     });
// });

// //UPDATE ROUTE - Update hotel
// router.put("/:hotel_id", middleware.checkHotelOwnership, function(req, res){
// Hotel.findByIdAndUpdate(req.params.hotel_id, req.body.hotel, function(err, updated){
//         if(err){
//             res.redirect("back");
//         } else {
//             res.redirect("/hotels/"+req.params.hotel_id);
//         }
//     });
// });

// //DESTROY ROUTE - Delete hotel
// router.delete("/:hotel_id", middleware.checkHotelOwnership, function(req, res){
//     Hotel.findByIdAndRemove(req.params.hotel_id, function(err){
//         if(err){
//             res.redirect("back");
//         } else {
//             res.redirect("/hotels/");
//         }
//     });
// });

module.exports = router;