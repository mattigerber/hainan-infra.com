const fs = require('fs');
const cheerio = require('cheerio');

const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));
const files = ['index.html', 'privacy.html', 'regulatory.html', 'terms.html'];

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(html);
  
  $('main *:not(:has(*))').each((i, el) => {
    const $el = $(el);
    if ($el.is('script') || $el.closest('svg').length) return;
    
    const content = $el.text().trim().replace(/\s+/g, ' ');
    if (content.length > 2) {
      for (const [key, obj] of Object.entries(translations)) {
        if (obj.en === content) {
          $el.attr('data-i18n', key);
          break;
        }
      }
    }
  });

  // Add data-i18n to explicit keys if missed
  fs.writeFileSync(file, $.html());
}

// Now generate the updated script.js
let scriptJs = fs.readFileSync('script.js', 'utf8');

// Build new key-values for en, ar, ru, zh
const newKeys = { en: [], ar: [], ru: [], zh: [] };
for (const [key, obj] of Object.entries(translations)) {
  for (const lang of ['en', 'ar', 'ru', 'zh']) {
    newKeys[lang].push(`    "${key}": ${JSON.stringify(obj[lang])},`);
  }
}

// We will inject the new keys before the closing brace of each language object in translations
for (const lang of ['en', 'ar', 'ru', 'zh']) {
  const targetStr = `${lang}: {`;
  const targetIdx = scriptJs.indexOf(targetStr);
  if (targetIdx !== -1) {
    const openBrace = targetIdx + targetStr.length;
    scriptJs = scriptJs.slice(0, openBrace) + '\n' + newKeys[lang].join('\n') + scriptJs.slice(openBrace);
  }
}

fs.writeFileSync('script.js', scriptJs);
console.log('Update complete!');
