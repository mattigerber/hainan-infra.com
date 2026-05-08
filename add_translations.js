const fs = require("fs");
const cheerio = require("cheerio");
const files = ["index.html", "privacy.html", "regulatory.html", "terms.html"];

// 1. Process HTML files
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const $ = cheerio.load(html);

  // Modal Gate Additions
  $(".gate-modal-close").attr("data-i18n", "gateClose");
  $(".gate-title").attr("data-i18n", "gateTitle");
  const gateDisclosures = $(".gate-disclosures p");
  if (gateDisclosures.length >= 2) {
    gateDisclosures.eq(0).attr("data-i18n", "gateDisclosure");
    gateDisclosures.eq(1).attr("data-i18n", "gateNotice");
  }

  const gateCheckboxes = $(".gate-checkbox span");
  if (gateCheckboxes.length >= 3) {
    gateCheckboxes.eq(0).attr("data-i18n", "gateCheckbox1");
    gateCheckboxes.eq(1).attr("data-i18n", "gateCheckbox2");
    gateCheckboxes.eq(2).attr("data-i18n", "gateCheckbox3");
  }

  $(".gate-submit").attr("data-i18n", "gateProceed");

  // Add Copyright underneath footer-disclaimer
  if ($(".footer-copyright").length === 0) {
    $(
      '<p class="footer-copyright" data-i18n="footerCopyright">&copy; 2026 Hainan Infrastructure Partners Ltd. All rights reserved.</p>',
    ).insertAfter(".footer-disclaimer");
  }

  fs.writeFileSync(file, $.html());
}

// 2. Add to script.js
let scriptJs = fs.readFileSync("script.js", "utf8");

const extraTranslations = {
  gateTitle: {
    en: "Institutional Access",
    ar: "الوصول المؤسسي",
    ru: "Институциональный доступ",
    zh: "机构访问",
  },
  gateDisclosure: {
    en: '<strong>Disclosure:</strong> This platform is operated exclusively by the Hainan Infrastructure Platform Ltd., not by the Hong Kong Entity "Hainan Infrastructure Partners Ltd."',
    ar: '<strong>إفشاء:</strong> يتم تشغيل هذه المنصة حصريًا بواسطة Hainan Infrastructure Platform Ltd.، وليس من قبل كيان هونج كونج "Hainan Infrastructure Partners Ltd."',
    ru: '<strong>Раскрытие информации:</strong> Эта платформа управляется исключительно Hainan Infrastructure Platform Ltd., а не гонконгской организацией "Hainan Infrastructure Partners Ltd."',
    zh: '<strong>信息披露：</strong>此平台由Hainan Infrastructure Platform Ltd.独家运营，而非香港实体"Hainan Infrastructure Partners Ltd."',
  },
  gateNotice: {
    en: "<strong>Notice:</strong> Hainan Infrastructure Partners Ltd. is a marketing entity only and is not SFC-licensed for virtual asset services.",
    ar: "<strong>ملاحظة:</strong> تعتبر Hainan Infrastructure Partners Ltd. كيانًا تسويقيًا فقط وليست مرخصة من SFC لخدمات الأصول الافتراضية.",
    ru: "<strong>Уведомление:</strong> Hainan Infrastructure Partners Ltd. является только маркетинговой организацией и не имеет лицензии SFC на услуги с виртуальными активами.",
    zh: "<strong>注意：</strong>Hainan Infrastructure Partners Ltd. 仅是营销实体，并未获得提供虚拟资产服务的SFC牌照。",
  },
  gateCheckbox1: {
    en: "I am not a Hong Kong resident",
    ar: "أنا لست مقيمًا في هونج كونج",
    ru: "Я не являюсь резидентом Гонконга",
    zh: "我不是香港居民",
  },
  gateCheckbox2: {
    en: "I am a professional or institutional investor",
    ar: "أنا مستثمر محترف أو مؤسسي",
    ru: "Я профессиональный или институциональный инвестор",
    zh: "我是专业或机构投资者",
  },
  gateCheckbox3: {
    en: "My use of this platform is governed by the laws of BVI",
    ar: "يخضع استخدامي لهذه المنصة لقوانين BVI",
    ru: "Мое использование этой платформы регулируется законодательством BVI",
    zh: "我对本平台的使用受BVI法律管辖",
  },
  gateProceed: {
    en: "Proceed",
    ar: "متابعة",
    ru: "Продолжить",
    zh: "继续",
  },
  gateClose: {
    en: "Close",
    ar: "إغلاق",
    ru: "Закрыть",
    zh: "关闭",
  },
  footerCopyright: {
    en: "&copy; 2026 Hainan Infrastructure Partners Ltd. All rights reserved.",
    ar: "&copy; 2026 Hainan Infrastructure Partners Ltd. جميع الحقوق محفوظة.",
    ru: "&copy; 2026 Hainan Infrastructure Partners Ltd. Все права защищены.",
    zh: "&copy; 2026 Hainan Infrastructure Partners Ltd. 保留所有权利。",
  },
  footerRegulatory: {
    en: "Regulatory Notice",
    ar: "إشعار تنظيمي",
    ru: "Регулирующее уведомление",
    zh: "监管通知",
  },
};

for (const lang of ["en", "ar", "ru", "zh"]) {
  const targetStr = `${lang}: {`;
  const targetIdx = scriptJs.indexOf(targetStr);
  if (targetIdx !== -1) {
    const openBrace = targetIdx + targetStr.length;
    let extraStr = "";
    for (const key of Object.keys(extraTranslations)) {
      extraStr += `\n    "${key}": ${JSON.stringify(extraTranslations[key][lang])},`;
    }
    scriptJs =
      scriptJs.slice(0, openBrace) + extraStr + scriptJs.slice(openBrace);
  }
}

fs.writeFileSync("script.js", scriptJs);
console.log("Update HTML and translations complete!");
