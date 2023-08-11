const express = require('express');
const Songs = require("../models/songModel");
const useAuth = require('../middleware/useAuth');
const router = express.Router();

// get all songs, no authentication
router.get('/', (req, res) => {
    Songs.find()
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(err.message));
})

router.use(useAuth);

router.post('/', (req, res) => {
    const song = req.body;
    const user = {
        id: req.user._id,
        username: req.user.username,
    };
    song.user = user;
    Songs.create(song)
        .then(() => res.status(200).json("success!"))
        .catch(err => res.status(400).json(err.message));

})

module.exports = router;