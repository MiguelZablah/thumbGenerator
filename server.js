const express = require('express');
const cors =  require('cors');

// upload file middle ware
let {upload} = require('./utils/multer');
// Thumb creation
const {createThumbnail} = require('./utils/videoThumb');

// Port Set up
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

app.post('/thumb/video', upload, (req, res) => {
    if(req.fileValidationError)
        return res.send(req.fileValidationError).status(400);

    var newFile = {
        fullName: req.file.filename,
        name: req.file.filename.substring(0, req.file.filename.indexOf('.')),
        ext: req.fileExt
    }

    // Testing
    // console.log(req.file, 'file');
    // console.log(newFile, 'newFile');

    // Create thumb
    createThumbnail(newFile).then((thumb) => {
        res.send(thumb);
    }).catch((err) => {
        console.log(err);
        res.status(400);
    });


});

app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});

module.exports.app = app;