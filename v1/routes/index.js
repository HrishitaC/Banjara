var express         = require("express");
var router = express.Router({mergeParams: true});
var passport        = require("passport");
var middleware = require("../middleware");
var Spot            = require("../models/spots"),
    Comment         = require("../models/comments"),
    User            = require("../models/users"),
    Packages            = require("../models/packages");

//============
//LANDING PAGE
//============
router.get("/", function(req, res){
    res.redirect("/spots");
});

//=============================
//      AUTH ROUTES
//=============================

//show register form
router.get("/register", function(req, res){
    res.render("users/register")
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, account: req.body.account});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.render("users/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/spots");
            });
        }
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("users/login");
});


//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/spots",
        failureRedirect: "/register",
    }), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/spots");
});

module.exports = router;