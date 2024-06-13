const express = require('express');
const Controller = require('./Controller');
const authenticate = require('./authenticate'); // Kimlik doğrulama middleware'ini import edin

const router = express.Router();

router.post('/signup', Controller.signup);
router.post('/delete', Controller.deleteUser);
router.post('/login', Controller.login);
router.post('/changeprofiledata', Controller.changeProfileData);
router.get('/user/profile', Controller.getUserProfile); // Yeni endpoint
router.post('/search', Controller.SearchProfile);
router.post('/createverify', Controller.createVerifyCode);
router.post('/verificationcode', Controller.verifyOTPCode);
router.post('/searchfilm', Controller.SearchFilm);
router.post('/film', Controller.Film);
router.post('/votefilm', Controller.VoteFilm);
router.post('/addwatchlist', Controller.addWatchList);
router.post('/getfilm', Controller.GetFilm);
router.get('/getmessages', Controller.GetMessages);

module.exports = router;
