const express = require('express');
const router = express.Router();

// Not YET IMPLEMENTED, maybe later on if needed
router.post('/shorten', async (req, res) => {
    const originalUrl = req.body.url;

    // Check if URL is already in DB, if so, just return that
    const existingId = await getOriginalUrl(originalUrl);
    if (existingId) {
        return res.json({ shortUrl: encode(existingId) });
    }

    const id = await getNextId();
    await saveOriginalUrl(id, originalUrl);

    res.json({ shortUrl: encode(id) });
});

router.get('/:shortUrl', async (req, res) => {
    const shortUrl = req.params.shortUrl;
    const id = decode(shortUrl);
    
    const originalUrl = await getOriginalUrl(id);
    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).send('URL not found');
    }
});

module.exports = router;