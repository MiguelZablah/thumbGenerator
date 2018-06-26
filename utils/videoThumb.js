const ffmpeg = require('fluent-ffmpeg');
const base64Img = require('base64-img');
const path = require('path');
var fs = require('fs');

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
var base64Thumb = (file, imgType) => {
    // console.log('Base64');
    const tempThumbUrl = path.join(__dirname, '../uploads/temp', `${file.name}${imgType}`);
    
    var base64 = base64Img.base64Sync(tempThumbUrl);
    return base64;
};

// Creates thumb depending on file type
var createThumbnail = (file) => {
    const fullName = file.fullName;
    const uploadsPath = path.join(__dirname, '../uploads', fullName);
    const tempPath = path.join(__dirname, '../uploads/temp');
    const imgType = '.jpg';

    if(file.ext === '.mp4'){
        return new Promise((res, rej) => {
            ffmpeg(uploadsPath).screenshots({
                count: 1,
                timestamps: ['5'],
                filename: `${file.name}${imgType}`,
                folder: tempPath,
                size: '200x200'
            }).on('end', () => {
                // console.log('Thumbnail for video finish');
                var img64 = base64Thumb(file, imgType);
                deleteTemp(tempPath);
                res({
                    name: file.fullName,
                    base64: img64
                });
            })
            .on('error', e => rej(e));
        });
    }
}

module.exports = {
    createThumbnail
}