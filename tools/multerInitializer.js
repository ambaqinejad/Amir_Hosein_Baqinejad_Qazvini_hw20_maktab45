const fs = require('fs');
const path = require('path');
const multer = require('multer');

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), 'public', 'images', 'avatars'))
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, `${req.session.blogger.username}-${Date.now()}-${file.originalname}`)
    }
});

module.exports = multer({
    storage: avatarStorage,
    fileFilter: (req, file, cb) => {
        console.log('456', req.body);
        if (file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Invalid type of image'), false);
        }
    }
})