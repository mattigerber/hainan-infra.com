const fs = require('fs');
const cheerio = require('cheerio');
const files = ['index.html', 'privacy.html', 'regulatory.html', 'terms.html'];
const results = {};
for (const file of files) {
  const html = fs.readFileSync(file, 'utf-8');
  const $ = cheerio.load(html);
  $('main *:not(:has(*))').each((i, el) => {
    let content = $(el).text().trim().replace(/\s+/g, ' ');
    if(content.length > 2 && !$(el).is('script') && !$(el).closest('svg').length) {
        if(!results[file]) results[file] = [];
        results[file].push(content);
    }
  });
}
console.log(JSON.stringify(results, null, 2));
