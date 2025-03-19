const express = require('express')
const app = express();
const port = 8008;

app.use(express.static('public'));

app.get('/', (req, res) =>  {
    //sends the static file (login page) once server is run to port 8008
    res.sendFile('help.html', {root: 'public'}, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

app.listen(port, () => {
    console.log(`Server waiting response on port ${port}`)
});