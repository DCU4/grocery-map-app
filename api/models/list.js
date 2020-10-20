var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var listSchema = new mongoose.Schema({
    title: { type: String, default: 'List 2' },
    locationId: '',
    list: [],
    created: {type: Date, default: Date.now},
    // user: {
    //     id: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "User"
    //     },
    //     username: String
    // }
});

listSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('List', listSchema);


