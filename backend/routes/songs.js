const express = require('express');
const Songs = require("../models/songModel");
const checkAuth = require('../middleware/checkAuth');
const useAuth = require('../middleware/useAuth');
const router = express.Router();

// get all songs, no authentication
router.get('/', (req, res) => {
    Songs.find().select("_id user song.name song.artist") // condense to summarised version
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(err.message));
})

router.get('/:id', checkAuth, async (req, res) => {
    const { id } = req.params;

    try {
        const song = await Songs.findOne({ _id: id }).lean();
        if (req.authorized) {
            // valid user token, check if song is created by user.
            song.canEdit = (req.user._id.toString() === song.user.id);
            console.log(req.user._id.toString(), song.user.id)
        } else {
            song.canEdit = false;
        }

        res.status(200).json(song);
    } catch (error) {
        res.status(400).json(error.message)
    }
})

router.use(useAuth);

router.post('/', (req, res) => {
    const song = req.body;
    const user = {
        id: req.user._id,
        username: req.user.username,
    };
    const SongEntry = {song, user}
    Songs.create(SongEntry)
        .then(() => res.status(200).json("success!"))
        .catch(err => res.status(400).json(err.message));

})

module.exports = router;