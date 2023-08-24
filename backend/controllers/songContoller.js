const Songs = require("../models/songModel");

/**
 * Get summarized details of all songs based on filter and sorted.
 * @param {*} req 
 * @param {*} res 
 */
const getSongs = async (req, res) => {
    var { sortBy, order, filterBy, filter: filterString, limit, offset } = req.query;
    switch (sortBy) {
        case "name":
        case "artist":
            sortBy = `song.${sortBy}`;
            break;
        case "averageScore":
        case "totalRatings":
            break;
        default:
            sortBy = "song.name"; // default to sorting by songname
    }

    switch (filterBy) {
        case "name":
        case "artist":
            filterBy = `song.${filterBy}`;
            break;
        case "username":
            filterBy = `user.${filterBy}`;
            break;
        default:
            filterBy = "song.name"; // default to filtering songname
    }

    if (isNaN(parseInt(limit))) {
        limit = 20; // default limit to 20
    } else {
        limit = parseInt(limit)
    }

    if (isNaN(parseInt(offset))) {
        offset = 0; // default offset to 0
    } else {
        offset = parseInt(offset)
    }
    const filter = {}
    filter[filterBy] = { "$regex": filterString, "$options": "i" };
    const aggregationPipeline = [{
            $match: filter
        }, {
            $project: {
                _id: 1,
                user: 1,
                'song.name': 1,
                'song.artist': 1,
                averageScore: 1,
                totalRatings: { $size: '$ratings' },
            }
        }, {
            $sort: {
                [sortBy]: (order === "desc" ? -1 : 1),
            },
    },]
    try {
        const allSongs = await Songs.aggregate(aggregationPipeline);
        const count = allSongs.length;

        const selectedSongs = await Songs.aggregate(aggregationPipeline)
            .collation({ locale: 'en', strength: 2 }) 
            .skip(offset)
            .limit(limit);
        const nextOffset = offset + limit < count ? offset + limit : null;
        const previousOffset = offset <= 0 
            ? null
            : offset - limit >= 0
                ? offset - limit
                : 0;
        const data = {
            count: count,
            next: nextOffset ? `/api/song/?sortBy=${sortBy}&order=${order}&filterBy=${filterBy}&filter=${filterString}&limit=${limit}&offset=${nextOffset}` 
                : null,
            previous: previousOffset ? `/api/song/?sortBy=${sortBy}&order=${order}&filterBy=${filterBy}&filter=${filterString}&limit=${limit}&offset=${previousOffset}` 
            : null,
            results: selectedSongs,
        }
        console.log("success!");
        res.status(200).json(data);
    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message})
    }
}

/**
 * Get details of song belonging to given id.
 * @param {*} req 
 * @param {*} res 
 */
const getSongDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const song = await Songs.findOne({ _id: id })
        console.log("success!")
        res.status(200).json(song);
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

/**
 * Get details of song belonging to given id only if user is owner of song.
 * @param {*} req 
 * @param {*} res 
 */
const getSongDetailsProtected = async (req, res) => {
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
        res.status(400).json({error: error.message})
    }
}

/**
 * Delete song of given id only if user is owner of song.
 * @param {*} req 
 * @param {*} res 
 */
const deleteSongProtected = async (req, res) => {
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
        res.status(400).json({error: error.message})
    }
}

/**
 * Creates new song, where owner is the authenticated user.
 * @param {*} req 
 * @param {*} res 
 */
const createSongProtected = (req, res) => {
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
        .catch(error => {
            console.log(error.message);
            res.status(400).json({error: error.message})
        });

}

/**
 * Updates song of given id only if user is owner of song.
 * @param {*} req 
 * @param {*} res 
 */
const updateSongProtected = async (req, res) => {
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
        res.status(400).json({error: error.message})
    }
}

/**
 * Deletes rating created by authenticated user from song belonging to given id.
 * @param {*} req 
 * @param {*} res 
 */
const deleteRatingProtected = async (req, res) => {
    const { id: songIdToDelete } = req.params;
    const userIdToDelete = req.user._id.toString();
    try {
        const song = await Songs.findById(songIdToDelete);
        const userRatingToDelete = song.ratings.filter((rating) => rating.user.id === userIdToDelete);
        const oldTotalScore = song.ratings.reduce((sum, rating) => sum + rating.score, 0);
        const newAverageScore = song.ratings.length - 1 === 0 ? 0 : (oldTotalScore - userRatingToDelete[0].score) / (song.ratings.length - 1);
        await Songs.findByIdAndUpdate(
            songIdToDelete, 
            {  
                averageScore: newAverageScore,
                $pull: { ratings: { 'user.id': userIdToDelete } } 
            },
            { timestamps: false },);
        res.status(200).json("success!")
    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message})
    }
}

/**
 * Updates rating created by authenticated user from song belonging to given id. If no rating that belongs to 
 * authenticated user exists, add a new rating.
 * @param {*} req 
 * @param {*} res 
 */
const updateRatingProtected = async (req, res) => {
    const { id: songIdToUpdate } = req.params;
    const userIdToUpdate = req.user._id.toString()
    const user = {
        id: userIdToUpdate,
        username: req.user.username,
    };
    const { score: newScore, comment: newComment } = req.body;
    if (newScore <=0 || newScore > 5) {
        console.log("Score must be between 1-5");
        res.status(400).json({error: "Score must be between 1-5"});
        return;
    }
    const newRating = { score: newScore, user, comment: newComment, createdAt: new Date(), updatedAt: new Date()};
    try {
        const song = await Songs.findById(songIdToUpdate);
        const userRatingToUpdate = song.ratings.filter((rating) => rating.user.id === userIdToUpdate)
        const alreadyRated = userRatingToUpdate.some(x => x);
        const oldTotalScore = song.ratings.reduce((sum, rating) => sum + rating.score, 0);
        if (alreadyRated) {
            const newAverageScore = (oldTotalScore - userRatingToUpdate[0].score + newScore) / song.ratings.length;
            await Songs.findOneAndUpdate(
                {_id: songIdToUpdate, 'ratings.user.id': userIdToUpdate}, 
                {
                    averageScore: newAverageScore, 
                    $set: {
                        'ratings.$.score': newScore,
                        'ratings.$.user': user,
                        'ratings.$.comment': newComment,
                        'ratings.$.updatedAt': new Date(),
                    },
                },
                { timestamps: false },);
        } else {
            const newAverageScore = (oldTotalScore + newScore) / (song.ratings.length + 1);
            await Songs.findByIdAndUpdate(
                songIdToUpdate, 
                {averageScore: newAverageScore, $push: {ratings: newRating}},
                { timestamps: false },);
        }
        res.status(200).json("success!")
    } catch (error) {
        console.log(error.message);
        res.status(400).json({error: error.message})
    }
}

module.exports = {getSongs, getSongDetails, getSongDetailsProtected, deleteSongProtected, updateSongProtected, createSongProtected, deleteRatingProtected, updateRatingProtected};