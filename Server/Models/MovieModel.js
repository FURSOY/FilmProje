const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    tconst: String,
    titleType: String,
    originalTitle: String,
    startYear: String,
    genres: String,
    imdbRating: Number,
    numVotes: Number,
    siteTotalRating: Number,
    siteNumVotes: Number
});

// Movie modeli
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
