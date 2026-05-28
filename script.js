const inputs = {
	totalRevenue: document.getElementById("totalRevenue"),
	avgOrderValue: document.getElementById("avgOrderValue"),
	leadRate: document.getElementById("leadRate"),
	prospectRate: document.getElementById("prospectRate"),
};

const outputs = {
	customersValue: document.getElementById("customersValue"),
	leadsValue: document.getElementById("leadsValue"),
	prospectsValue: document.getElementById("prospectsValue"),
	customersMeta: document.getElementById("customersMeta"),
	leadsMeta: document.getElementById("leadsMeta"),
	prospectsMeta: document.getElementById("prospectsMeta"),
	customersFill: document.getElementById("customersFill"),
	leadsFill: document.getElementById("leadsFill"),
	prospectsFill: document.getElementById("prospectsFill"),
	leadRateValue: document.getElementById("leadRateValue"),
	prospectRateValue: document.getElementById("prospectRateValue"),
};

const chartRows = Array.from(document.querySelectorAll(".chart-row"));

const safeNumber = (value) => {
	const parsed = Number.parseFloat(value);
	return Number.isFinite(parsed) ? parsed : 0;
};

const formatPercent = (value) => `${Math.round(value)}%`;

const calculate = () => {
	const totalRevenue = safeNumber(inputs.totalRevenue.value);
	const avgOrderValue = safeNumber(inputs.avgOrderValue.value);
	const leadRate = safeNumber(inputs.leadRate.value);
	const prospectRate = safeNumber(inputs.prospectRate.value);

	outputs.leadRateValue.textContent = formatPercent(leadRate);
	outputs.prospectRateValue.textContent = formatPercent(prospectRate);

	if (avgOrderValue <= 0 || leadRate <= 0 || prospectRate <= 0) {
		updateResults(0, 0, 0);
		return;
	}

	const customers = Math.round(totalRevenue / avgOrderValue);
	const leads = Math.round((customers * 100) / leadRate);
	const prospects = Math.round((leads * 100) / prospectRate);

	updateResults(customers, leads, prospects);
};

const updateResults = (customers, leads, prospects) => {
	outputs.customersValue.textContent = customers.toString();
	outputs.leadsValue.textContent = leads.toString();
	outputs.prospectsValue.textContent = prospects.toString();

	const prospectsSafe = Math.max(prospects, 1);
	const leadsPercent = (leads / prospectsSafe) * 100;
	const customersPercent = (customers / prospectsSafe) * 100;

	outputs.prospectsMeta.textContent = formatPercent(100);
	outputs.leadsMeta.textContent = formatPercent(leadsPercent);
	outputs.customersMeta.textContent = formatPercent(customersPercent);

	outputs.prospectsFill.style.width = "100%";
	outputs.leadsFill.style.width = `${Math.min(leadsPercent, 100)}%`;
	outputs.customersFill.style.width = `${Math.min(customersPercent, 100)}%`;

	updateChart(customers, leads, prospects);
};

const updateChart = (customers, leads, prospects) => {
	const maxValue = Math.max(prospects, 1);

	chartRows.forEach((row, index) => {
		const ratio = (index + 1) / chartRows.length;
		const monthProspects = prospects * ratio;
		const monthLeads = leads * ratio;
		const monthCustomers = customers * ratio;

		const prospectsWidth = (monthProspects / maxValue) * 100;
		const leadsWidth = (monthLeads / maxValue) * 100;
		const customersWidth = (monthCustomers / maxValue) * 100;

		row.querySelector(".bar-prospects").style.width = `${prospectsWidth}%`;
		row.querySelector(".bar-leads").style.width = `${leadsWidth}%`;
		row.querySelector(".bar-customers").style.width = `${customersWidth}%`;
	});
};

Object.values(inputs).forEach((input) => {
	input.addEventListener("input", calculate);
});

calculate();


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
                if (el.tagName === 'BUTTON' || el.hasAttribute('title')) {
                    el.title = i18n[lang][key];
                }
                if (el.childNodes.length > 0 && el.childNodes[0].nodeType === 3) {
                    // Update text node if exists without killing svg
                    el.childNodes[0].nodeValue = i18n[lang][key];
                } else if(!el.hasAttribute('title')) {
                    el.textContent = i18n[lang][key];
                }
                
                // Fallback for purely text elements
                if (!el.children.length && !el.hasAttribute('title')) {
                    el.textContent = i18n[lang][key];
                }
            }
        });
    });
    // Trigger on load
    languageSelect.dispatchEvent(new Event('change'));
}

// Menu toggle removed — no JS needed for it.
