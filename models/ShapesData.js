var mongoose = require('mongoose');

var schema = mongoose.Schema({
    userEmail: String,
    JSONData: String
});

var ShapesData = mongoose.model("ShapesData", schema);
module.exports = ShapesData;