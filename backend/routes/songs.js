const express = require('express');
const Songs = require("../models/songModel");
const checkAuth = require('../middleware/checkAuth');
const useAuth = require('../middleware/useAuth');
const router = express.Router();

// get all songs, no authentication
router.get('/', (req, res) => {
    Songs.find().select("_id user song.name song.artist averageScore") // condense to summarised version
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
        .then(() => {
            console.log("successfully added");
            res.status(200).json("success!");
        })
        .catch(err => {
            console.log(err.message);
            res.status(400).json(err.message);
        });

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
        const owner = await Songs.findById(id).select("user.id");
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

router.delete('/protected/rate/:id', async (req, res) => {
    const { id: songIdToDelete } = req.params;
    const userIdToDelete = req.user._id.toString();
    try {
        const song = await Songs.findById(songIdToDelete);
        const userRatingToDelete = song.ratings.filter((rating) => rating.user.id === userIdToDelete);
        const oldTotalScore = song.ratings.reduce((sum, rating) => sum + rating.score, 0);
        const newAverageScore = (oldTotalScore - userRatingToDelete[0].score) / (song.ratings.length - 1);
        await Songs.findByIdAndUpdate(
            songIdToDelete, 
            {  
                averageScore: newAverageScore,
                $pull: { ratings: { 'user.id': userIdToDelete } } 
            });
        res.status(200).json("success!")
    } catch (error) {
        console.log(error.message)
        res.status(400).json(error.message)
    }
});

router.patch('/protected/rate/:id', async (req, res) => {
    const { id: songIdToUpdate } = req.params;
    const userIdToUpdate = req.user._id.toString()
    const user = {
        id: userIdToUpdate,
        username: req.user.username,
    };
    const { score: newScore, comment: newComment } = req.body;
    const rating = { score: newScore, user, comment: newComment };
    try {
        const song = await Songs.findById(songIdToUpdate);
        const userRatingToUpdate = song.ratings.filter((rating) => rating.user.id === userIdToUpdate)
        const alreadyRated = userRatingToUpdate.some(x => x);
        const oldTotalScore = song.ratings.reduce((sum, rating) => sum + rating.score, 0);
        if (alreadyRated) {
            const newAverageScore = (oldTotalScore - userRatingToUpdate[0].score + newScore) / song.ratings.length;
            await Songs.findOneAndUpdate(
                {_id: songIdToUpdate, 'ratings.user.id': userIdToUpdate}, 
                {averageScore: newAverageScore, $set: {'ratings.$': rating}});
        } else {
            const newAverageScore = (oldTotalScore + newScore) / (song.ratings.length + 1);
            await Songs.findByIdAndUpdate(
                songIdToUpdate, 
                {averageScore: newAverageScore, $push: {ratings: rating}});
        }
        res.status(200).json("success!")
    } catch (error) {
        console.log(error.message)
        res.status(400).json(error.message)
    }
})
module.exports = router;