const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    user: {
        id: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
    },
    song: {
        name: {
            type: String,
            required: true,
        },
        artist: {
            type: String,
            required: true,
        },
        capo: {
            type: Number,
            required: true,
        },
        key: {
            noteLetter: {
                type: String,
                required: true,
            },
            accidental: {
                type: String,
                required: false,
            },
            isMajor: {
                type: Boolean,
                required: true,
            }
        },
        sections: [{
            title: {
                type: String,
                required: true,
            },
            key: {
                noteLetter: {
                    type: String,
                    required: true,
                },
                accidental: {
                    type: String,
                    required: false,
                },
                isMajor: {
                    type: Boolean,
                    required: true,
                }
            },
            chords: [{
                chord: {
                    noteLetter: {
                        type: String,
                        required: true,
                    },
                    accidental: {
                        type: String,
                        required: false,
                    },
                    chordType: {
                        type: String,
                        required: false,
                    }
                },
                lyric: {
                    type: String,
                    required: false,
                },
            }]
        }]
    },
    ratings: [{
        score: {
            type:Number,
            required: true,
        },
        user: {
            id: {
                type: String,
                required: true,
            },
            username: {
                type: String,
                required: true,
            },
        },
        comment: {
            type: String,
            required: false,
        },
    }],
    averageScore: {
        type: Number,
        default: 0,
    }
})

module.exports = mongoose.model('songs', songSchema);