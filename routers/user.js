var express = require("express");
var passport = require("passport");
var multer = require("multer");

var UserController = require("../controllers/user");
var Utils = require("../utils/utils");

var router = express.Router();

// set the current user
router.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});


//===============================================================
//
//      Upload profile image file to 'uploads' folder 
//      in disk storage using multer's diskStorage method
//
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({storage});


//=====================================
//
//      HOMEPAGE ROUTE
//
router.get("/", UserController.homepage);



//=====================================
//
//      SIGN UP ROUTES
//

// display sign up form
router.get("/signup", UserController.signUpForm);


// sign up the new user (save to DB and log them in)
router.post("/signup", upload.single('profile-image'), 
    UserController.signup, 
    passport.authenticate('login', {
            failureRedirect: '/login'
        }), 
        UserController.login
);


//=====================================
//
//      LOGIN ROUTES
//

// display the login form
router.get("/login", UserController.loginForm);


// authenticate the user's login attempt
router.post("/login", 
    passport.authenticate('login', {
            failureRedirect: '/login'
        }), 
        UserController.login
);


//=====================================
//
//      USER PROFILE ROUTES
//

// display user's profile (if logged in)
router.get('/user-profile', Utils.ensureAuthenticated, UserController.userprofile);

// display form for editing user profile
router.get("/edit-profile", Utils.ensureAuthenticated, UserController.editForm);

// saves updated user profile data
router.post("/edit-profile", upload.single('profile-image'), UserController.edit);

// display form for deleting user profile
router.get("/delete-profile", Utils.ensureAuthenticated, UserController.deleteForm);

// remove user from database
router.post("/delete-profile", UserController.deleteUser);

//=====================================
//
//      GRASA APP ROUTE
//

router.get('/grasa', Utils.ensureAuthenticated, UserController.loadGrasa);

// add back Utils.ensureAuthenticated to these
router.get('/bezier-test', UserController.bezierTest);
router.get('/quad-test', UserController.quadTest);

//========================================
//
//      LOGOUT ROUTE
//
router.get("/logout", UserController.logout);



// export this router
module.exports = router;
