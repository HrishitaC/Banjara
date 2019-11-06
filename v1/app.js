var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Spot            = require("./models/spots"),
    Comment         = require("./models/comments"),
    User            = require("./models/users"),
    seedDB          = require("./seeds");

var spotCommentRoutes   = require("./routes/spotComments"),
    packageCommentRoutes   = require("./routes/packageComments"),
    spotRoutes      = require("./routes/spots"),
    packageRoutes   = require("./routes/packages"),
    userRoutes      = require("./routes/users"),
    indexRoutes     = require("./routes/index");

mongoose.connect("mongodb://localhost/Banjara_DB");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");


//============
//Seed the DB
//============

// seedDB();

//=====================
//   PASSPORT CONFIG
//=====================
app.use(require("express-session")({
    secret: "DBMSProject",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===================================
//Passing user details to all routes
//===================================

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//======================
//   REQUIRING ROUTES
//======================
app.use("/spots/:id/comments", spotCommentRoutes);
app.use("/packages/:id/comments", packageCommentRoutes);
app.use("/spots", spotRoutes);
app.use("/packages", packageRoutes);
app.use("/users", userRoutes);
app.use("/", indexRoutes);

app.listen(3000, function(){
    console.log("Banjara server has started!");
});