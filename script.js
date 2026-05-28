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
