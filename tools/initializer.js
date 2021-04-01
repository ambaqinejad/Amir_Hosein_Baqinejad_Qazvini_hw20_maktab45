const fs = require('fs');
const path = require('path');

module.exports = (function() {
    (fs.existsSync(path.join(process.cwd(), 'public', 'images')) ||
        fs.mkdirSync(path.join(process.cwd(), 'public', 'images')));
    (fs.existsSync(path.join(process.cwd(), 'public', 'images', 'avatars')) ||
        fs.mkdirSync(path.join(process.cwd(), 'public', 'images', 'avatars')));
    (fs.existsSync(path.join(process.cwd(), 'public', 'images', 'post_images')) ||
        fs.mkdirSync(path.join(process.cwd(), 'public', 'images', 'post_images')));
    (fs.existsSync(path.join(process.cwd(), 'public', 'images', 'post_header_image')) ||
        fs.mkdirSync(path.join(process.cwd(), 'public', 'images', 'post_header_image')));
})()