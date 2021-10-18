var User = require("../models/user");
var fs = require("fs");

function homepage(req, res, next) {
    console.log("---> HOMEPAGE function");
    User.find()
        .sort({ createdAt: "descending" })
        .exec(function (err, users) {
            if (err) { return next(err); }
            console.log("------> res.render index.js");
            res.render("index.ejs", { users: users });
        });
}

function signUpForm (req, res) {
    res.render("signup", {currentUser:res.locals.currentUser});
}

function signup (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    var given, middle, family, 
        street, city, state, postcode, 
        dob, mobile, email = "";
    
    given = req.body.given;
    if (typeof req.body.middle !== 'undefined') {
        middle = req.body.middle;
    }
    family = req.body.family;
    street = req.body.street;
    city = req.body.city;
    state = req.body.state;
    postcode = req.body.postcode;
    dob = req.body.dob;
    mobile = req.body.mobile;
    email = req.body.email;
    
    User.findOne({ username:username }, function(err, user) {

        if (err) { return next(err); }
        if (user) {
            req.flash("error", "User already exists");
            return res.redirect("/signup");
        }
        
        var newUser = new User ({
            username: username,
            password: password,
            name: { 
                given: given,
                middle: middle,
                family: family
            },
            address: {
                street: street,
                city: city,
                state: state,
                postcode: postcode
            },
            dob: dob,
            mobile: mobile,
            email: email
        });

        /*
        console.log("req.file is: " + req.file);
        console.log("req.file.filename is: " + req.file.filename);
        console.log("req.file.path is: " + req.file.path);
        console.log("req.file.fieldname is: " + req.file.fieldname);
        */

        newUser.profileImage.data = fs.readFileSync(req.file.path);
        newUser.profileImage.contentType = 'image/png';
        newUser.save(next);
    });
}

async function userprofile(req, res) {
  res.render("user-profile");
}

function loginForm (req, res) {
    res.render("login");
}

// login controller, redirects to relevant profile page / dashboard
// based on user's role
function login (req, res) {
    res.redirect("/user-profile");
}


function logout (req, res) {
    req.logout();
    res.redirect("/");
}

function editForm (req, res) {
    res.render("edit-profile");
}

function edit (req, res, next) {
    //console.log("req.body is: " + req.body);
    //console.log("req.body.street is: " + req.body.street);
    
    req.user.name.given = req.body.given;
    req.user.name.middle = req.body.middle;
    req.user.name.family = req.body.family;
    req.user.dob = req.body.dob;
    req.user.address.street = req.body.street;
    req.user.address.city = req.body.city;
    req.user.address.state = req.body.state;
    req.user.address.postcode = req.body.postcode;
    req.user.mobile = req.body.mobile;
    req.user.email = req.body.email;

    
    if (typeof req.file !== 'undefined') {
        req.user.profileImage.data = fs.readFileSync(req.file.path);
        req.user.profileImage.contentType = 'image/png';
    }

    //console.log("req.user is: " + req.user);

    req.user.save(function(err) {
        if (err) {
            next(err);
            return;
        }
        req.flash("info", "Profile updated!");
        res.redirect("/user-profile");
    });
    
   //res.send(req.body);
}

function deleteForm (req, res) {
    res.render("delete-profile");
}

function deleteUser (req, res, next) {
    
    const userToDelete = res.locals.currentUser.username;
    console.log("userToDelete: " + userToDelete);
    User.findOneAndRemove({username: userToDelete})
    .exec(function(err) {
        if (err) { return next(err); }
        req.flash("info", "Account successfully deleted!");
        req.logout();
        res.redirect("/");
    });
}

function loadGrasa (req, res) {
    res.render("grasa");
}

function bezierTest (req, res) {
    res.render("bezier-test");
}

function quadTest (req, res) {
    res.render("quad-test");
}

module.exports = {
    homepage,
    signUpForm,
    signup,
    userprofile,
    loginForm,
    login,
    logout,
    editForm,
    edit,
    deleteForm,
    deleteUser,
    loadGrasa,
    bezierTest,
    quadTest
}