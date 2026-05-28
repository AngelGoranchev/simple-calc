const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('data-i18n="campaignSettings"')) {
    html = html.replace('<section class="panel panel-left">', '<section class="panel panel-left">\n          <h2 data-i18n="campaignSettings" style="margin-bottom: 20px;">Campaign Settings</h2>');
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('Added Campaign Settings header');
} else {
    console.log('Already there');
}
