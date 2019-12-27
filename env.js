var fs = require('fs');

exports.message = fs.readFileSync('public/header.html', 'utf8');
exports.finMessage = fs.readFileSync('public/footer.html', 'utf8');
exports.error404=fs.readFileSync('public/404.html', 'utf8');

exports.fullscreen=fs.readFileSync('public/fullscreen.js', 'utf8');
exports.loadPosts=fs.readFileSync('public/loadPosts.js', 'utf8');
exports.story = fs.readFileSync('public/story.js', 'utf8');