const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    name: {
        type: String,
        required: true,

    },
    part: {
        type: String
    },
    topic: {
        type: String
    },
    room: {
        type: String
    },
    invcode: {
        type: String
    },

    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }


})
module.exports = mongoose.model('class', ClassSchema)