require('dotenv').config();
// const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const mongoString = process.env.MONGO_URI;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();
// app.use(cors())
app.use(express.json());

// const routes = require('./routes/routes');
const deck = require('./routes/deck');
const session = require('./routes/session');

app.use('/api/deck', deck)
app.use('/api/session', session)

// Schedule a task to run every day at midnight (or any other schedule you see fit)
cron.schedule('0 3 * * *', async () => {
    console.log('Running a job at 03:00 at Europe/Stockholm timezone');
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 1); // adjust as needed for your "old" criteria

    // Update all decks with the logic defined in your decrement-intervals endpoint
    const decksToUpdate = await deck.Model.Deck.find({
        'cards.lastReviewed': { $lt: thresholdDate }
    });

    for (const deck of decksToUpdate) {
        for (const card of deck.cards) {
            if (card.interval > 1 && new Date(card.lastReviewed) < thresholdDate) {
                card.interval--;
            }
        }
        await deck.save();
    }
}, {
    scheduled: true,
    timezone: "Europe/Stockholm"
});


app.listen(3066, () => {
    console.log(`Server Started at ${3066}`)
})