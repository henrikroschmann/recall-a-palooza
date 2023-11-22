const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, default: '' },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    options: [{ type: String }],
    interval: { type: Number, default: null },
    type: { type: Number, required: true },
    lastReviewed: { type: Date, default: null },
    learningMaterialLink: { type: String, default: '' }
});


const DeckSchema = new mongoose.Schema({
    id: { type: String, required: true },
    cards: { type: [FlashcardSchema], required: true } // Use reference of FlashcardSchema here
})

module.exports = {
    Flashcard: mongoose.model('Flashcard', FlashcardSchema),
    Deck: mongoose.model('Deck', DeckSchema)
}