var express = require("express");
var router = express.Router({mergeParams: true});
var middleware = require("../middleware");
var Spot            = require("../models/spots"),
    Comment         = require("../models/comments"),
    User            = require("../models/users"),
    Package           = require("../models/packages");

//======================
//     PACKAGES ROUTE
//======================

//INDEX ROUTE - Display all spots
router.get("/", function(req, res){
    Package.find({}, function(err, allPackages){
        if(err){
            console.log(err);
        } else{
            res.render("packages/index", {packages: allPackages});
        }
    });
});

//CREATE ROUTE - Add new package to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var spots = req.body.addedSpots;

    var newPackage = {
        name: name,
        image: image,
        description: description,
        author: author,
        spots: spots
    }

    Package.create(newPackage, function(err, addedPackage){
        if(err){
            console.log(err);
        } else {
            User.findById(req.user._id, function(err, foundUser){
                foundUser.madePackages.push(addedPackage);
                foundUser.save();
            });
            res.redirect("/packages");
        }
    });
});

//NEW ROUTE - Display the form to add new spot
router.get("/new", middleware.isLoggedIn, function(req, res){
    Spot.find({}, function(err, foundSpots){
        if(err){
            console.log(err);
        } else {
            res.render("packages/new", {spots: foundSpots});
        }
    });
});

//SHOW ROUTE - Display details of one spot
router.get("/:id", function(req, res){
    Package.findById(req.params.id).populate("spots comments").exec(function(err, foundPackage){
        if(err){
            console.log(err);
        } else {
            res.render("packages/show", {package: foundPackage});
        }
    });
});

//EDIT ROUTE - Display the edit form
router.get("/:id/edit", middleware.checkPackageOwnership, function(req, res){
    Package.findById(req.params.id, function(err, foundPackage){
        res.render("packages/edit", {package: foundPackage});
    });
});

//UPDATE ROUTE - Update the tourist spot
router.put("/:id", middleware.checkPackageOwnership, function(req, res){
    Package.findByIdAndUpdate(req.params.id, req.body.package, function(err, updated){
        if(err){
            console.log(err);
            res.redirect("/packages");
        } else {
            res.redirect("/packages/"+req.params.id);
        }
    });
});

//DESTROY ROUTE - Remove spot
router.delete("/:id", middleware.checkPackageOwnership, function(req, res){
    Package.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/packages");
        } else {
            res.redirect("/packages");
        }
    });
});

//CART Route
router.post("/:id/cart", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, foundUser){
        if(err){
            console.log(err)
        } else {
            Package.findById(req.params.id, function(err, foundPackage){
                if(err){
                    console.log(err);
                } else {
                    foundUser.cartPackages.push(foundPackage);
                    foundUser.save();
                }
            res.redirect("/packages");
            });
        }
    });
});

module.exports = router;