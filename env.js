var fs = require('fs');

exports.message = fs.readFileSync('include/header.html', 'utf8');
exports.finMessage = fs.readFileSync('include/footer.html', 'utf8');
exports.error404=fs.readFileSync('public/404.html', 'utf8');
