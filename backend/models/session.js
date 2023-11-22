const mongoose = require('mongoose');

const SessionDataSchema = new mongoose.Schema({
    id: { type: String, required: true },
    question: { type: String, required: true },
    timeToAnswer: { type: Number, required: true },
    correct: { type: Boolean, required: true },
    rating: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    learningMaterialLink: { type: String, default: '' }
})

const SessionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    data: { type: [SessionDataSchema], required: true }
})

module.exports = {
    SessionData: mongoose.model('SessionData', SessionDataSchema),
    Session: mongoose.model('Session', SessionSchema)
}