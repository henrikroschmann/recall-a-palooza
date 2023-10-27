const express = require('express');
const Model = require('../models/deck');
const router = express.Router();

//Post Method
router.post('/', async (req, res) => {
    const data = new Model.Deck({
        id: req.body.id,
        cards: req.body.cards
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get all Method
router.get('/', async (req, res) => {
    try {
        const data = await Model.Deck.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
//Get by ID Method
router.get('/:id', async (req, res) => {
    try {
        const data = await Model.Deck.findOne({ id: req.params.id });
        if (!data) {
            res.status(404).json({ message: 'Not Found' });
        } else {
            res.json(data);
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const idValue = req.params.id;

        // Query using 'id' directly
        const result = await Model.Deck.findOneAndDelete({ id: idValue });  

        if (!result) {
            res.status(404).json({ message: 'Not Found' });
        } else {
            res.send(result);
        }
    }
    catch (error) {
        console.error("Error deleting deck:", error);  // Log the error to the console
        res.status(500).json({ message: error.message });
    }
});


// Update by ID Method
router.patch('/:id', async (req, res) => {
    try {
        const idValue = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.Deck.findOneAndUpdate(
            { id: idValue },  // Query by 'id' column
            updatedData, 
            options
        );

        if (!result) {
            res.status(404).json({ message: 'Not Found' });
        } else {
            res.send(result);
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;