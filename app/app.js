const express = require('express')
const app = express();
const port = 8008;

app.use(express.static('public'));

app.get('/', (req, res) =>  {
    res.sendFile('login.html', {root: 'public'}, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

app.listen(port, () => {
    console.log(`Server waiting response on port ${port}`)
});