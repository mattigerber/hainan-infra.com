const fs = require("fs");

let scriptJs = fs.readFileSync("script.js", "utf8");

const t = {
  en: "Intended for Professional Investors (SFO Sch. 1). Hainan Infrastructure Partners Ltd. provides information only. Products offered by Hainan Infrastructure Platform Ltd.. Not SFC-licensed.",
  ar: "مخصص للمستثمرين المحترفين (SFO Sch. 1). توفر Hainan Infrastructure Partners Ltd. المعلومات فقط. يتم تقديم المنتجات من قبل Hainan Infrastructure Platform Ltd.. غير مرخصة من قبل SFC.",
  ru: "Предназначено для профессиональных инвесторов (SFO Sch. 1). Hainan Infrastructure Partners Ltd. предоставляет только информацию. Продукты предлагаются Hainan Infrastructure Platform Ltd.. Не лицензировано SFC.",
  zh: "仅面向专业投资者 (SFO Sch. 1)。Hainan Infrastructure Partners Ltd. 仅提供信息。产品由Hainan Infrastructure Platform Ltd.提供。未获SFC持牧。",
};

for (const lang of ["en", "ar", "ru", "zh"]) {
  const targetStr = `${lang}: {`;
  const targetIdx = scriptJs.indexOf(targetStr);
  if (targetIdx !== -1) {
    const openBrace = targetIdx + targetStr.length;
    scriptJs =
      scriptJs.slice(0, openBrace) +
      `\n    "footerDisclaimer": ${JSON.stringify(t[lang])},` +
      scriptJs.slice(openBrace);
  }
}

fs.writeFileSync("script.js", scriptJs);
console.log("Update complete!");
