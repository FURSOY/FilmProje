const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user"
    },
    avatar: {
        type: String,
        required: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    votedMovies: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        type: Array
    },
    watchlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        type: Array
    },
    watchedlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        type: Array
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;