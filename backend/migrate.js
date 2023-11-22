const { Deck } = require('./models/deck');
const { Session } = require('./models/session');

const migrationJobs = async () => {

    try {
        const decks = await Deck.find({});
        for (const deck of decks) {
            let changesMade = false;
            for (const card of deck.cards) {

                if (typeof card.learningMaterialLink === 'undefined') {
                    card.learningMaterialLink = '';
                    changesMade = true;
                }

                if (typeof card.title === 'undefined') {
                    card.title = '';
                    changesMade = true;
                }
            }

            if (changesMade) {
                await deck.save();
                console.log('Migration of decks completed!');
            }
        }

        const sessions = await Session.find({})
        for (const session of sessions) {
            let changesMade = false;
            if (typeof session.learningMaterialLink === 'undefined') {
                session.learningMaterialLink = '';
                changesMade = true;
            }
            if (changesMade) {
                await sessions.save();
                console.log('Migration of sessions completed!');
            }
        }

    } catch (error) {
        console.error('Migration failed:', error);
    }
};

module.exports = migrationJobs;
