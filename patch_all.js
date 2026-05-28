const fs = require('fs');

// Patch index.html
let html = fs.readFileSync('index.html', 'utf8');

// Replace standard ids with data-i18n
html = html.replace(/<div class="logo">LeadPredictor<\/div>/, '<div class="logo" data-i18n="logo">LeadPredictor</div>');
html = html.replace(/id="lbl_dashboardCalc"/, 'data-i18n="dashboardCalc"');
html = html.replace(/id="lbl_language"/, 'data-i18n="language"');
html = html.replace(/id="lbl_campaignStart"/, 'data-i18n="campaignStart"');
html = html.replace(/id="lbl_campaignEnd"/, 'data-i18n="campaignEnd"');
html = html.replace(/id="lbl_totalRevenue"/, 'data-i18n="totalRevenue"');
html = html.replace(/id="lbl_avgOrderValue"/, 'data-i18n="avgOrderValue"');
html = html.replace(/id="lbl_forecastOverview"/, 'data-i18n="forecastOverview"');
html = html.replace(/<p>Monthly distribution based on current targets\.<\/p>/, '<p data-i18n="forecastDesc">Monthly distribution based on current targets.</p>');

for(let i=1; i<=6; i++) {
    html = html.replace(new RegExp(`<span class="chart-label">Month ${i}<\/span>`), `<span class="chart-label" data-i18n="month${i}">Month ${i}</span>`);
}

html = html.replace(/id="lbl_prospects"/, 'data-i18n="prospects"');
html = html.replace(/id="lbl_leads"/, 'data-i18n="leads"');
html = html.replace(/id="lbl_customers"/, 'data-i18n="customers"');
html = html.replace(/id="lbl_leadRate"/, 'data-i18n="leadRate"');
html = html.replace(/id="lbl_prospectRate"/, 'data-i18n="prospectRate"');

fs.writeFileSync('index.html', html, 'utf8');

// Patch style.css to fix logo wrap
let css = fs.readFileSync('style.css', 'utf8');
if (!css.includes('white-space: nowrap;')) {
    css = css.replace(/\.logo\s*\{/, '.logo {\n  white-space: nowrap;\n  flex-shrink: 0;');
    fs.writeFileSync('style.css', css, 'utf8');
}

// Patch script.js
let js = fs.readFileSync('script.js', 'utf8');

// Remove old i18n logic using regex/substring if possible, or just overwrite the entire file with a clean read.
// Since we only appended last time, we can chop it off where it says "const i18n = {"
const i18nIndex = js.indexOf('const i18n = {');
if(i18nIndex > -1) {
    js = js.substring(0, i18nIndex).trim();
}

const newLogic = `
const i18n = {
    en: {
        logo: "LeadPredictor",
        dashboardCalc: "Dashboard Calculator",
        campaignSettings: "Campaign Settings",
        language: "Language",
        campaignStart: "Campaign Start",
        campaignEnd: "Campaign End",
        totalRevenue: "Total Revenue",
        avgOrderValue: "Avg. Order Value",
        prospects: "Prospects",
        leads: "Leads",
        customers: "Customers",
        forecastOverview: "Forecast Overview",
        forecastDesc: "Monthly distribution based on current targets.",
        month1: "Month 1",
        month2: "Month 2",
        month3: "Month 3",
        month4: "Month 4",
        month5: "Month 5",
        month6: "Month 6",
        leadRate: "Lead Response Rate",
        prospectRate: "Prospect Response Rate"
    },
    bg: {
        logo: "Прогнозатор на клиенти",
        dashboardCalc: "Табло калкулатор",
        campaignSettings: "Настройки на кампанията",
        language: "Език",
        campaignStart: "Начало на кампанията",
        campaignEnd: "Край на кампанията",
        totalRevenue: "Общ приход",
        avgOrderValue: "Средна стойност на поръчка",
        prospects: "Контакти",
        leads: "Потенциални клиенти",
        customers: "Клиенти",
        forecastOverview: "Обзор на прогнозата",
        forecastDesc: "Месечно разпределение според текущите цели.",
        month1: "Месец 1",
        month2: "Месец 2",
        month3: "Месец 3",
        month4: "Месец 4",
        month5: "Месец 5",
        month6: "Месец 6",
        leadRate: "Честота на отговор от потенциални клиенти",
        prospectRate: "Честота на отговор от контакти"
    }
};

const languageSelect = document.getElementById("language");
if (languageSelect) {
    languageSelect.addEventListener("change", (e) => {
        const lang = e.target.value;
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (i18n[lang] && i18n[lang][key]) {
                el.textContent = i18n[lang][key];
            }
        });
    });
    // Trigger on load
    languageSelect.dispatchEvent(new Event('change'));
}
`;

js = js + "\n\n" + newLogic;
fs.writeFileSync('script.js', js, 'utf8');

console.log('Done patching.');
