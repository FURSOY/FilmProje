const express = require('express');
const Controller = require('./Controller');
const authenticate = require('./authenticate');

const router = express.Router();

router.post('/signup', Controller.signup);
router.post('/delete', Controller.deleteUser);
router.post('/login', Controller.login);
router.post('/changeprofiledata', Controller.changeProfileData);
router.get('/user/profile', authenticate, Controller.getUserProfile);
router.post('/getuser', Controller.getUser);
router.post('/search', Controller.SearchProfile);
router.post('/createverify', Controller.createVerifyCode);
router.post('/verificationcode', Controller.verifyOTPCode);
router.post('/searchfilm', Controller.SearchFilm);
router.post('/film', Controller.Film);
router.post('/votefilm', Controller.VoteFilm);
router.post('/addwatchlist', Controller.addWatchList);
router.post('/addwatchedlist', Controller.addWatchedList);
router.post('/getfilm', Controller.GetFilmById); // POST metodunu GetFilmById ile değiştirildi
router.get('/getmessages', Controller.GetMessages);
router.post('/getwatchlist', Controller.GetUserWatchFilm);
router.post('/getwatchedlist', Controller.GetUserWatchedFilm);
router.post('/denme', Controller.denme);

module.exports = router;
