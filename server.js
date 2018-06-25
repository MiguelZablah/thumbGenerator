const express = require('express');
const cors =  require('cors');

// setup
let {upload} = require('./utils/multer');
const port = process.env.PORT || 3000;

var app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send([
        {
            url: '/thumb/video',
            header: 'name: file, upload: video',
            return: 'base 64 thumb of video'
        }
    ]);
});

app.post('/thumb/video', upload, async (req, res) => {
    if(req.fileValidationError)
        return res.send(req.fileValidationError).status(400);

    console.log(req.file, 'file');
    res.send("works");
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});

module.exports.app = app;