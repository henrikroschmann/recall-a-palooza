require('dotenv').config();
// const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
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

app.listen(3066, () => {
    console.log(`Server Started at ${3066}`)
})