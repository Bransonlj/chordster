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

// get song details
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const song = await Songs.findOne({ _id: id })
        res.status(200).json(song);
    } catch (error) {
        res.status(400).json(error.message)
    }
})

router.use(useAuth);

// get song details but check authorization first and only return details if authorized.
router.get('/protected/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const song = await Songs.findById(id);
        if (song.user.id === req.user._id.toString()) {
            // song belongs to req user, allow access
            res.status(200).json(song);
        } else {
            res.status(401).json({error: "unauthorized"});
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).json(error.message)
    }
})

router.delete('/protected/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const song = await Songs.findById(id);
        if (song.user.id === req.user._id.toString()) {
            // song belongs to req user, allow delete
            const deletedSong = await Songs.findByIdAndDelete(id);
            console.log("deleted successfully")
            res.status(200).json(deletedSong);
        } else {
            res.status(401).json({error: "unauthorized"});
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).json(error.message)
    }
})

router.post('/protected/', (req, res) => {
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

router.put('/protected/:id', async (req, res) => {
    const { id } = req.params;
    const song = req.body;
    const user = {
        id: req.user._id,
        username: req.user.username,
    };
    const SongEntry = {song, user};
    
    try {
        // verify if user id is owner of song
        owner = await Songs.findById(id).select("user.id");
        if (user.id.toString() === owner.user.id.toString()) {
            await Songs.findByIdAndUpdate(id, SongEntry)
            console.log("successfully updated!")
            res.status(200).json("success!")
        } else {
            console.log("unauthorized")
            res.status(401).json({error: "unauthorized"});
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).json(error.message)
    }
})
module.exports = router;