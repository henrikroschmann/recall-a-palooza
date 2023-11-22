const cron = require('node-cron');
const deck = require('./routes/deck');

const setupCronJobs = () => {
    cron.schedule('0 3 * * *', async () => {
        console.log('Running a job at 03:00 at Europe/Stockholm timezone');
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - 1);

        const decksToUpdate = await deck.Model.Deck.find({
            'cards.lastReviewed': { $lt: thresholdDate }
        });

        for (const deckToUpdate of decksToUpdate) {
            for (const card of deckToUpdate.cards) {
                if (card.interval > 1 && new Date(card.lastReviewed) < thresholdDate) {
                    card.interval--;
                }
            }
            await deckToUpdate.save();
        }
    }, {
        scheduled: true,
        timezone: "Europe/Stockholm"
    });
};

module.exports = setupCronJobs;
