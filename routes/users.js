const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/pinterestdb");
 const Schema = mongoose.Schema;

// Define the user schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    dp: {
        type: String,
        default: 'defaultDpUrl' // You can set a default DP URL here
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    }
});
userSchema.plugin(plm);

// Create the user model
module.exports = mongoose.model('User', userSchema);

