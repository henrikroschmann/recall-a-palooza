const express = require('express');
const Model = require('../models/session');
const router = express.Router();

//Post Method
router.post('/', async (req, res) => {
    const data = new Model.Session({
        id: req.body.id,
        data: req.body.data
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
        const data = await Model.Session.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// //Get by ID Method
router.get('/:id', async (req, res) => {
    try {
        const data = await Model.Session.findOne({ id: req.params.id });
        if (!data) {
            res.status(404).json({ message: 'Not Found' });
        } else {
            res.json(data);
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// //Update by ID Method
// router.patch('/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const updatedData = req.body;
//         const options = { new: true };

//         const result = await Model.findByIdAndUpdate(
//             id, updatedData, options
//         )

//         res.send(result)
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

module.exports = router;