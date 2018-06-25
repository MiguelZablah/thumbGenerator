const multer =  require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/')
    },
    filename: function (req, file, callback) {
        let ext = ''; // set default extension (if any)
        if (file.originalname.split(".").length>1) // checking if there is an extension or not.
            ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        callback(null, Date.now() + ext)
    }
});

var upload = multer({ storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.mp4') {
            req.fileValidationError = "Forbidden extension";
            return callback(null, false, req.fileValidationError);
        }
        req.fileExt = ext;
        callback(null, true, req.fileExt);
    }
}).single('file');

module.exports = {
    upload
}