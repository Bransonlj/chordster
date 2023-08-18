const express = require('express');
const Songs = require("../models/songModel");
const {
    getSongs, 
    getSongDetails, 
    getSongDetailsProtected, 
    deleteSongProtected, 
    updateSongProtected, 
    createSongProtected,
    deleteRatingProtected,
    updateRatingProtected,
} = require('../controllers/songContoller');
const useAuth = require('../middleware/useAuth');
const router = express.Router();

// get all songs, no authentication
router.get('/', getSongs);

// get song details
router.get('/:id', getSongDetails)

router.use(useAuth);

// --------- PROTECTED ROUTES ---------

// get song details but check authorization first and only return details if authorized.
router.get('/protected/:id', getSongDetailsProtected)

router.delete('/protected/:id', deleteSongProtected)

router.post('/protected/', createSongProtected)

router.put('/protected/:id', updateSongProtected)

router.delete('/protected/rate/:id', deleteRatingProtected);

router.patch('/protected/rate/:id', updateRatingProtected)

module.exports = router;