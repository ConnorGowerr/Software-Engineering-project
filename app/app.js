const express = require('express');
const app = express;
const port = 8008;

app.get('/', (req, res) =>  {
    res.send('In the front room, straight up coding it and by it lets just say, my server.');
});

app.listen(port, () => {
    console.log(`Server waiting response on port ${port}`);
});