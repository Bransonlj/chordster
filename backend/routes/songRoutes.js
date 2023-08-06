const express = require('express');
const Songs = require("../models/songModel");

const router = express.Router();

router.post('/', (req, res) => {
    Songs.create(req.body)
        .then(() => res.status(200).json("success!"))
        .catch(err => res.status(400).json(err.message));

})

router.get('/', (req, res) => {
    Songs.find()
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(err.message));
})

module.exports = router;