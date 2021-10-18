//===============================================
//
//    utils.js :
//
//          contains helper functions
//
//-----------------------------------------------

const User      = require("../models/user");

// uses Passport.js's isAuthenticated() method
// to confirm user authentication
function ensureAuthenticated(req, res, next) {
    
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("info", "You must be logged in to see this page.");
        res.redirect("/login");
    }
}

module.exports = {
    ensureAuthenticated
}