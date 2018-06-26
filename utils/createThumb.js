const ffmpeg = require('fluent-ffmpeg');
const Jimp = require("jimp");
const base64Img = require('base64-img');
const path = require('path');
var fs = require('fs');

// Folder variables
const toUploads = '../uploads';
const toTemp = '../uploads/temp';

// To clear temp folder
var deleteTemp = (directory) => {
    fs.readdir(directory, (err, files) => {
        if (err) 
            throw err;
        
        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
            });
        }
    });  
};

// Creates base64 from img jpg
var base64Thumb = (file, thumbExt) => {
    // console.log('Base64');
    const tempThumbUrl = path.join(__dirname, toTemp, `${file.name}${thumbExt}`);
    
    var base64 = base64Img.base64Sync(tempThumbUrl);
    return base64;
};

// Creates thumb depending on file type
var createThumbnail = (file) => {
    const fullName = file.fullName;
    const uploadsPath = path.join(__dirname, toUploads, fullName);
    const tempPath = path.join(__dirname, toTemp);
    const thumbExt = '.jpg';
    const tiemoutExist = 500;

    return new Promise((res, rej) => {
        if(file.ext === '.mp4'){
            ffmpeg(uploadsPath).screenshots({
                count: 1,
                timestamps: ['5'],
                filename: `${file.name}${thumbExt}`,
                folder: tempPath,
                size: '200x200'
            }).on('end', () => {
                // console.log('Thumbnail for video finish');
                var img64 = base64Thumb(file, thumbExt);
                deleteTemp(tempPath);
                res({
                    name: file.fullName,
                    base64: img64
                });
            })
            .on('error', e => rej(e));
        }else if(file.ext === '.png' || file.ext === '.jpg' || file.ext === '.gif'){
            Jimp.read(uploadsPath).then(function (image) {
                image.quality(60)
                .resize(250, 250, Jimp.RESIZE_NEAREST_NEIGHBOR)
                .write(`${tempPath}/${file.name}${thumbExt}`, () => {
                    var img64 = base64Thumb(file, thumbExt);
                    deleteTemp(tempPath);
                    res({
                        name: file.fullName,
                        base64: img64
                    });
                });
            }).catch(function (err) {
                rej('No thumb generated!');
            });
        }else{
            rej(`Format: ${file.ext} not valid!`);
        }
    });
}

module.exports = {
    createThumbnail
}