// Constants and Variables
const minDataPointsForBoxPlot = 2;
const validYoeBucket = new Set(["Entry (0-1)", "Mid (2-6)", "Senior (7-10)", "Senior + (11+)"]);
const offersPerPage = 10;
let currentPage = 1;
let offers = [];
let filteredOffers = [];
let currentSort = { column: null, order: 'asc' };
let totalPages = 0;
const svgWidth = 16;
const svgHeight = 16;

let currentLang = 'en';
const translations = {
    en: {
        title: 'Compensation Analyzer',
        salaryDistribution: 'Salary Distribution',
        yoeBucketBoxPlot: 'YOE Bucket Box Plot',
        companyBoxPlot: 'Company Box Plot',
        offersPerCompany: 'Offers per Company',
        averageSalaryByCompany: 'Average Salary by Company',
        searchPlaceholder: 'Company/Location/Role',
        search: 'Search',
        filters: 'Filters',
        yoeYears: 'Years of Experience:',
        min: 'Min:',
        max: 'Max:',
        totalSalary: 'Total Salary (₹ LPA):',
        includesInterviewExp: 'Includes Interview Experience',
        apply: 'Apply',
        clearFilters: 'Clear Filters',
        previous: 'Previous',
        next: 'Next',
        stats: 'Based on {n} recs parsed between {start} and {end} (★ = Posts that incl. Interview Experience)',
        offersAxis: '# Offers',
        avgLPA: 'Avg ₹ LPA',
        avgTotal: 'Avg Total',
        tableId: 'ID',
        tableCompany: 'Company',
        tableLocationDate: 'Location | Date',
        tableRole: 'Role',
        tableYoe: 'Yoe',
        tableTotal: 'Total',
        tableBase: 'Base',
        salaries: 'Salaries',
        roleFilter: 'Role',
        allRoles: 'All Roles'
    },
    es: {
        title: 'Analizador de Compensación',
        salaryDistribution: 'Distribución Salarial',
        yoeBucketBoxPlot: 'Diagrama de caja por Experiencia',
        companyBoxPlot: 'Diagrama de caja por Compañía',
        offersPerCompany: 'Ofertas por Compañía',
        averageSalaryByCompany: 'Salario Promedio por Compañía',
        searchPlaceholder: 'Empresa/Ubicación/Rol',
        search: 'Buscar',
        filters: 'Filtros',
        yoeYears: 'Años de Experiencia:',
        min: 'Mín:',
        max: 'Máx:',
        totalSalary: 'Salario Total (₹ LPA):',
        includesInterviewExp: 'Incluye Experiencia de Entrevista',
        apply: 'Aplicar',
        clearFilters: 'Borrar Filtros',
        previous: 'Anterior',
        next: 'Siguiente',
        stats: 'Basado en {n} registros entre {start} y {end} (★ = Publicaciones con Experiencia de Entrevista)',
        offersAxis: '# Ofertas',
        avgLPA: 'Prom ₹ LPA',
        avgTotal: 'Prom Total',
        tableId: 'ID',
        tableCompany: 'Compañía',
        tableLocationDate: 'Ubicación | Fecha',
        tableRole: 'Puesto',
        tableYoe: 'Años',
        tableTotal: 'Total',
        tableBase: 'Base',
        salaries: 'Salarios',
        roleFilter: 'Rol',
        allRoles: 'Todos'
    },
    hi: {
        title: 'कंपनसेशन विश्लेषक',
        salaryDistribution: 'वेतन वितरण',
        yoeBucketBoxPlot: 'अनुभव बॉक्स प्लॉट',
        companyBoxPlot: 'कंपनी बॉक्स प्लॉट',
        offersPerCompany: 'कंपनी प्रति ऑफर',
        averageSalaryByCompany: 'कंपनी अनुसार औसत वेतन',
        searchPlaceholder: 'कंपनी/स्थान/भूमिका',
        search: 'खोजें',
        filters: 'फ़िल्टर',
        yoeYears: 'अनुभव (वर्ष):',
        min: 'न्यूनतम:',
        max: 'अधिकतम:',
        totalSalary: 'कुल वेतन (₹ LPA):',
        includesInterviewExp: 'इंटरव्यू अनुभव शामिल',
        apply: 'लागू करें',
        clearFilters: 'फ़िल्टर साफ़ करें',
        previous: 'पिछला',
        next: 'अगला',
        stats: '{start} से {end} के बीच {n} रिकॉर्ड्स पर आधारित (★ = इंटरव्यू अनुभव वाली पोस्ट)',
        offersAxis: '# ऑफर',
        avgLPA: 'औसत ₹ LPA',
        avgTotal: 'औसत कुल',
        tableId: 'आईडी',
        tableCompany: 'कंपनी',
        tableLocationDate: 'स्थान | दिनांक',
        tableRole: 'भूमिका',
        tableYoe: 'अनुभव',
        tableTotal: 'कुल',
        tableBase: 'बेस',
        salaries: 'वेतन',
        roleFilter: 'भूमिका',
        allRoles: 'सभी भूमिकाएँ'
    },
    kn: {
        title: 'ಪರಿಹಾರ ವಿಶ್ಲೇಷಕ',
        salaryDistribution: 'ಸಂಬಳ ಹಂಚಿಕೆ',
        yoeBucketBoxPlot: 'ಅನುಭವ ಬಾಕ್ಸ್ ಪ್ಲಾಟ್',
        companyBoxPlot: 'ಕಂಪನಿ ಬಾಕ್ಸ್ ಪ್ಲಾಟ್',
        offersPerCompany: 'ಕಂಪನಿಗೆ ಆಫರ್',
        averageSalaryByCompany: 'ಕಂಪನಿಯ ಸರಾಸರಿ ವೇತನ',
        searchPlaceholder: 'ಕಂಪನಿ/ಸ್ಥಳ/ಪಾತ್ರ',
        search: 'ಹುಡುಕಿ',
        filters: 'ಫಿಲ್ಟರ್',
        yoeYears: 'ಅನುಭವ (ವರ್ಷ):',
        min: 'ಕನಿಷ್ಟ:',
        max: 'ಗರಿಷ್ಠ:',
        totalSalary: 'ಒಟ್ಟು ವೇತನ (₹ LPA):',
        includesInterviewExp: 'ಇಂಟರ್ವ್ಯೂ ಅನುಭವ ಸೇರಿದೆ',
        apply: 'ಅನ್ವಯಿಸಿ',
        clearFilters: 'ಫಿಲ್ಟರ್ ಅಳಿಸಿ',
        previous: 'ಹಿಂದಿನ',
        next: 'ಮುಂದಿನ',
        stats: '{start} ರಿಂದ {end} ರವರೆಗೆ {n} ದಾಖಲೆಗಳ ಆಧಾರಿತ (★ = ಇಂಟರ್ವ್ಯೂ ಅನುಭವ ಇರುವ ಪೋಸ್ಟ್)',
        offersAxis: '# ಆಫರ್',
        avgLPA: 'ಶರಾಸರಿ ₹ LPA',
        avgTotal: 'ಶರಾಸರಿ ಒಟ್ಟು',
        tableId: 'ಐಡಿ',
        tableCompany: 'ಕಂಪನಿ',
        tableLocationDate: 'ಸ್ಥಳ | ದಿನಾಂಕ',
        tableRole: 'ಪಾತ್ರ',
        tableYoe: 'ಅನುಭವ',
        tableTotal: 'ಒಟ್ಟು',
        tableBase: 'ಬೇಸ್',
        salaries: 'ವೇತನ',
        roleFilter: 'ಪಾತ್ರ',
        allRoles: 'ಎಲ್ಲಾ ಪಾತ್ರಗಳು'
    },
    de: {
        title: 'Vergütungsanalysator',
        salaryDistribution: 'Gehaltsverteilung',
        yoeBucketBoxPlot: 'Erfahrungs-Boxplot',
        companyBoxPlot: 'Unternehmens-Boxplot',
        offersPerCompany: 'Angebote pro Unternehmen',
        averageSalaryByCompany: 'Durchschnittsgehalt nach Unternehmen',
        searchPlaceholder: 'Firma/Ort/Rolle',
        search: 'Suchen',
        filters: 'Filter',
        yoeYears: 'Jahre Erfahrung:',
        min: 'Min:',
        max: 'Max:',
        totalSalary: 'Gesamtgehalt (₹ LPA):',
        includesInterviewExp: 'Mit Interview-Erfahrung',
        apply: 'Übernehmen',
        clearFilters: 'Filter löschen',
        previous: 'Zurück',
        next: 'Weiter',
        stats: 'Basierend auf {n} Einträgen zwischen {start} und {end} (★ = Beiträge mit Interview-Erfahrung)',
        offersAxis: '# Angebote',
        avgLPA: 'Durchschn ₹ LPA',
        avgTotal: 'Durchschn Gesamt',
        tableId: 'ID',
        tableCompany: 'Firma',
        tableLocationDate: 'Ort | Datum',
        tableRole: 'Rolle',
        tableYoe: 'Erfahrung',
        tableTotal: 'Gesamt',
        tableBase: 'Grund',
        salaries: 'Gehälter',
        roleFilter: 'Rolle',
        allRoles: 'Alle Rollen'
    }
};

function t(key) {
    return translations[currentLang][key] || key;
}

const starSVG = `
    <svg fill="#000000" width="14px" height="14px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="icon">
        <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z"/>
    </svg>
`;

Highcharts.setOptions({
    chart: {
        backgroundColor: 'transparent',
        style: { fontFamily: 'Inter, sans-serif' }
    },
    colors: ['#3478f6'],
    credits: { enabled: false },
    responsive: {
        rules: [{
            condition: { maxWidth: 768 },
            chartOptions: { chart: { height: '60%' } }
        }]
    }
});

let globalFilterState = {
    searchString: '',
    yoeRange: [null, null], // Assuming null means no filter
    salaryRange: [null, null],
    includeInterviewExp: false,
    roleFilter: ''
};

const GLOBAL_ALLOWED_FILTERS = ["company", "location", "mapped_role"];

function setLanguage(lang) {
    currentLang = translations[lang] ? lang : 'en';
    document.documentElement.lang = currentLang;
    document.getElementById('pageTitle').textContent = t('title');
    document.getElementById('hdrSalaryDistribution').textContent = t('salaryDistribution');
    document.getElementById('hdrYoeBucket').textContent = t('yoeBucketBoxPlot');
    document.getElementById('hdrCompanyBox').textContent = t('companyBoxPlot');
    document.getElementById('hdrOffersPerCompany').textContent = t('offersPerCompany');
    document.getElementById('hdrAvgSalary').textContent = t('averageSalaryByCompany');
    document.getElementById('searchInput').placeholder = t('searchPlaceholder');
    document.getElementById('btnSearch').textContent = t('search');
    document.getElementById('btnFilters').textContent = t('filters');
    document.getElementById('lblYoeYears').textContent = t('yoeYears');
    document.querySelectorAll('.lblMin').forEach(el => el.textContent = t('min') || 'Min:');
    document.querySelectorAll('.lblMax').forEach(el => el.textContent = t('max') || 'Max:');
    document.getElementById('lblTotalSalary').textContent = t('totalSalary');
    document.getElementById('lblInterviewExp').textContent = t('includesInterviewExp');
    document.getElementById('btnApply').textContent = t('apply');
    document.getElementById('btnClearFilters').textContent = t('clearFilters');
    document.getElementById('btnPrev').textContent = t('previous');
    document.getElementById('btnNext').textContent = t('next');
    document.getElementById('lblRoleFilter').textContent = t('roleFilter');
    populateRoleFilter(offers);

    // Refresh stats and charts with new labels
    setStatsStr(filteredOffers);
    plotHistogram(filteredOffers, 'total');
    mostOfferCompanies(filteredOffers);
    averageSalaryByCompany(filteredOffers);
    plotBoxPlot(filteredOffers, 'total', 'companyBoxPlot', 'company', new Set([]));
    plotBoxPlot(filteredOffers, 'total', 'yoeBucketBoxPlot', 'mapped_yoe', validYoeBucket);
    displayOffers(currentPage);
}

// Utility Functions
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @param {any[]} data
 * @param {string} searchTerm
 * @param {string[]} searchKeys
 */
function filterCompensationsByKeys(data, searchTerm, searchKeys) {
    const fuseOptions = {
        threshold: 0.2,
        keys: searchKeys
    };
    const fuse = new Fuse(data, fuseOptions);
    const result = fuse.search(searchTerm);
    return result.map(r => r.item);
}

function setStatsStr(data) {
    const nRecs = data.length;
    const startDate = data[0]?.creation_date;
    const endDate = data[nRecs - 1]?.creation_date;
    let statsStr = t('stats')
        .replace('{n}', nRecs)
        .replace('{start}', startDate)
        .replace('{end}', endDate);
    document.getElementById('statsStr').innerHTML = statsStr;
}


function formatSalaryInINR(lpa) {
    const totalRupees = Math.ceil(lpa * 100000);
    let rupeesStr = totalRupees.toString();
    let lastThree = rupeesStr.substring(rupeesStr.length - 3);
    const otherNumbers = rupeesStr.substring(0, rupeesStr.length - 3);
    if (otherNumbers != '') lastThree = ',' + lastThree;
    return `₹${otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree}`;
}

function extractValues(data, key) {
    return data.map(item => item[key]);
}

function calculateFrequencies(values) {
    return values.reduce((acc, value) => {
        const bin = Math.floor(value / 10);
        acc[bin] = (acc[bin] || 0) + 1;
        return acc;
    }, {});
}

function prepareChartData(frequencies) {
    return Object.entries(frequencies).sort(([a], [b]) => a - b).map(([bin, count]) => ({
        name: `${bin * 10}-${bin * 10 + 9}`,
        y: count
    }));
}

function populateRoleFilter(data) {
    const select = document.getElementById('roleFilterSelect');
    if (!select) return;
    const previous = globalFilterState.roleFilter;
    select.innerHTML = '';
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = t('allRoles');
    select.appendChild(defaultOpt);

    const roles = Array.from(new Set(data.map(o => o.mapped_role))).sort();
    roles.forEach(role => {
        const opt = document.createElement('option');
        opt.value = role;
        opt.textContent = role;
        select.appendChild(opt);
    });

    select.value = previous;
}

// Highcharts Initialization Functions
function initializeHistogramChart(chartData, baseOrTotal) {
    Highcharts.chart('salaryBarPlot', {
        chart: { type: 'column' },
        title: { text: '' },
        xAxis: {
            type: 'category',
            title: { text: `${capitalize(baseOrTotal)} Compensation (₹ LPA)` },
            labels: { rotation: 0 }
        },
        yAxis: { title: { text: '' } },
        legend: { enabled: true },
        series: [{ name: t('tableTotal'), data: chartData, color: '#3478f6' }],
        plotOptions: {
            series: {
                dataLabels: { enabled: true, format: '{point.y}' },
            }
        },
    });
}

function initializeBarChart(categories, counts) {
    Highcharts.chart('companyBarPlot', {
        chart: { type: 'bar' },
        title: { text: '' },
        xAxis: {
            categories: categories,
            title: { text: null }
        },
        yAxis: {
            min: 0,
            title: { text: t('offersAxis'), align: 'high' },
            labels: { overflow: 'justify' }
        },
        tooltip: { valueSuffix: ' occurrences' },
        plotOptions: { bar: { dataLabels: { enabled: true } } },
        legend: { enabled: true },
        series: [{ name: t('offersPerCompany'), data: counts, color: '#3478f6' }]
    });
}

// Function to initialize the Highcharts chart for box plot
function initializeBoxPlotChart(docId, boxPlotData, baseOrTotal, roleOrCompany) {
    Highcharts.chart(docId, {
        chart: { type: 'boxplot' },
        title: { text: '' },
        legend: { enabled: true },
        xAxis: {
            categories: boxPlotData.map(item => item.name),
            title: { text: '' },
            labels: { rotation: -90 }
        },
        yAxis: {
            title: { text: `${capitalize(baseOrTotal)} Compensation (₹ LPA)` }
        },
        series: [{
            name: t('salaries'),
            data: boxPlotData.map(item => item.data[0]),
            tooltip: { headerFormat: `<em>${capitalize(roleOrCompany)}: {point.key}</em><br/>` },
            color: '#3478f6'
        }]
    });
}

// Data Processing Functions
function quantile(arr, q) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    return sorted[base + 1] !== undefined ? sorted[base] + rest * (sorted[base + 1] - sorted[base]) : sorted[base];
}

function groupSalariesBy(jsonData, groupBy, valueKey) {
    return jsonData.reduce((acc, item) => {
        const key = item[groupBy];
        const value = item[valueKey];
        if (!acc[key]) acc[key] = [];
        acc[key].push(value);
        return acc;
    }, {});
}

function calculateBoxPlotData(salariesByGroup, validItems, minDataPoints = minDataPointsForBoxPlot) {
    return Object.keys(salariesByGroup).filter(key => salariesByGroup[key].length >= minDataPoints && (validItems.size === 0 || validItems.has(key))).map(key => {
        const values = salariesByGroup[key];
        return {
            name: key,
            data: [[Math.min(...values), quantile(values, 0.25), quantile(values, 0.5), quantile(values, 0.75), Math.max(...values)]]
        };
    }).sort((a, b) => b.data[0][2] - a.data[0][2]).slice(0, 20);
}

// Plotting Functions
function plotHistogram(jsonData, baseOrTotal) {
    const totalValues = extractValues(jsonData, baseOrTotal);
    const totalFrequencies = calculateFrequencies(totalValues);
    const chartData = prepareChartData(totalFrequencies);
    initializeHistogramChart(chartData, baseOrTotal);
}

function plotBoxPlot(jsonData, baseOrTotal, docId, roleOrCompany, validItems) {
    const salariesByGroup = groupSalariesBy(jsonData, roleOrCompany, baseOrTotal);
    const boxPlotData = calculateBoxPlotData(salariesByGroup, validItems);
    initializeBoxPlotChart(docId, boxPlotData, baseOrTotal, roleOrCompany);
}

function getSortArrow(column) {
    if (currentSort.column === column) {
        return currentSort.order === 'asc' ?
            `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 6V18M12 6L7 11M12 6L17 11" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>` :
            `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 6V18M12 18L7 13M12 18L17 13" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;
    }
    // Default state (no sorting)
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 24 24"><path d="M6 9l6-6 6 6z M18 15l-6 6-6-6z" fill="#000" /></svg>`;
}

// Display and Sorting Functions
function displayOffers(page) {
    const startIndex = (page - 1) * offersPerPage;
    const endIndex = startIndex + offersPerPage;
    const paginatedOffers = filteredOffers.slice(startIndex, endIndex);

    const table = document.createElement('table');
    table.classList.add('table');
    const emptyRow = table.insertRow();
    emptyRow.innerHTML = `
    <th style="width: 5%"></th><th style="width: 15%"></th>
    <th style="width: 30%"></th><th style="width: 25%"></th>
    <th style="width: 5%"></th><th style="width: 20%"></th>
    `;
    const headerRow = table.insertRow();
    headerRow.style.border = 'none';
    const indexHeader = headerRow.insertCell();
    indexHeader.innerHTML = '<b style="font-size: 13px;" data-column="#">#</b>';
    const idHeader = headerRow.insertCell();
    idHeader.innerHTML = `<b style="font-size: 13px;">${t('tableId')}</b>`;
    const companyHeader = headerRow.insertCell();
    companyHeader.innerHTML = `
    <b style="font-size: 13px;" >${t('tableCompany')}<br>
    <span class="text-secondary">${t('tableLocationDate')}</span></b>
    `;
    const roleHeader = headerRow.insertCell();
    roleHeader.innerHTML = `<b style="font-size: 13px;" >${t('tableRole')}</b>`;
    const yoeHeader = headerRow.insertCell();
    yoeHeader.innerHTML = `<b style="font-size: 13px;" data-column="yoe" role="button"> ${t('tableYoe')} ${getSortArrow('yoe')}</b>`;
    const salaryHeader = headerRow.insertCell();

    salaryHeader.innerHTML = `
    <p class="text-end" style="margin-bottom: 0px;">
    <b style="font-size: 13px;" data-column="total" role="button">${getSortArrow('total')} ${t('tableTotal')} <br>
    <span class="text-secondary">${t('tableBase')}</span></b></p>
    `;

    // Add event listeners to headers for sorting
    headerRow.querySelectorAll('b[data-column]').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');
            if (column === '#') {
                removeSorting();
            } else if (column) {
                sortOffers(column);
            }
        });
    });

    paginatedOffers.forEach((offer, index) => {
        const row = table.insertRow();
        const indexCell = row.insertCell();
        indexCell.innerHTML = `<p>${startIndex + index + 1}</p>`;
        const idCell = row.insertCell();
        idCell.innerHTML = `
        <p>
            <abbr title="attribute">
                <a class="link-primary" target="_blank" href="https://leetcode.com/discuss/compensation/${offer.id}">
                    ${offer.id}
                </a>
            </abbr>
            ${'interview_exp' in offer && offer.interview_exp !== 'N/A' ?
                `<span style="margin-left: 4px;">
                <a class="link-primary" target="_blank" style="text-decoration: none;" href='${offer.interview_exp}'>★</a>
                </span>` :
            ''}
        </p>
        `;
        const companyCell = row.insertCell();
        companyCell.innerHTML = `
        <b style="font-size: 13px;">${offer.company}</b>
        <br><span class="text-secondary">
        ${offer.location} | ${offer.creation_date}
        </span>`;
        const roleCell = row.insertCell();
        roleCell.innerHTML = `
        <b style="font-size: 13px;">${offer.mapped_role}</b>
        <br><span class="text-secondary">${offer.role}</span>`;
        const yoeCell = row.insertCell();
        yoeCell.textContent = offer.yoe;
        const salaryCell = row.insertCell();
        salaryCell.innerHTML = `
        <p class="text-end" style="margin-bottom: 0px;">
        <b style="font-size: 13px;">${formatSalaryInINR(offer.total)}</b>
        <br><span class="text-secondary" style="font-size: 13px;">
        ${formatSalaryInINR(offer.base)}</span></p>
        `;
    });

    const container = document.getElementById('offersTable');
    container.innerHTML = '';
    container.appendChild(table);
    renderPageOptions();

}

function sortOffers(column) {
    if (currentSort.column === column) {
        // Toggle order: desc -> asc -> no sorting
        if (currentSort.order === 'asc') {
            currentSort.column = null;
            currentSort.order = 'desc';
        } else if (currentSort.order === 'desc') {
            currentSort.order = 'asc'; // Set order to asc after desc
        } else {
            currentSort.order = 'desc'; // Default to asc when no sorting
        }
    } else {
        // Set new column and default to ascending order
        currentSort.column = column;
        currentSort.order = 'desc';
    }

    // Sort filteredOffers based on currentSort
    if (currentSort.column) {
        filteredOffers.sort((a, b) => {
            if (a[currentSort.column] < b[currentSort.column]) {
                return currentSort.order === 'asc' ? -1 : 1;
            } else if (a[currentSort.column] > b[currentSort.column]) {
                return currentSort.order === 'asc' ? 1 : -1;
            } else {
                return 0;
            }
        });
    } else {
        // Default sorting by id in descending order when no column is selected
        filteredOffers.sort((a, b) => b.id - a.id);
    }
    displayOffers(currentPage);
}

function renderPageOptions() {
    const pageSelect = document.getElementById('pageSelect');
    pageSelect.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i === currentPage) {
            option.selected = true;
        }
        pageSelect.appendChild(option);
    }
}

function mostOfferCompanies(jsonData) {
    const companyCounts = countCompanies(jsonData);
    let [categories, counts] = sortAndSliceData(companyCounts);

    initializeBarChart(categories, counts);
}

function countCompanies(data) {
    return data.reduce((acc, { company }) => {
        acc[company] = (acc[company] || 0) + 1;
        return acc;
    }, {});
}

function sortAndSliceData(companyCounts) {
    const sortedData = Object.entries(companyCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

    const categories = sortedData.map(([company]) => company);
    const counts = sortedData.map(([, count]) => count);

    return [categories, counts];
}

function averageSalaryByCompany(jsonData) {
    const companyTotals = {};
    jsonData.forEach(({ company, total }) => {
        if (!companyTotals[company]) {
            companyTotals[company] = [];
        }
        companyTotals[company].push(total);
    });

    const avgData = Object.entries(companyTotals)
        .map(([comp, totals]) => ({
            name: comp,
            avg:
                totals.reduce((acc, val) => acc + val, 0) /
                totals.length,
        }))
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 10);

    const categories = avgData.map((d) => d.name);
    const averages = avgData.map((d) => parseFloat(d.avg.toFixed(2)));

    Highcharts.chart("avgCompanyBarPlot", {
        chart: { type: "bar" },
        title: { text: "" },
        xAxis: { categories: categories, title: { text: null } },
        yAxis: {
            min: 0,
            title: { text: t('avgLPA'), align: "high" },
            labels: { overflow: "justify" },
        },
        tooltip: { valueSuffix: " LPA" },
        plotOptions: { bar: { dataLabels: { enabled: true } } },
        legend: { enabled: true },
        series: [
            {
                name: t('avgTotal'),
                data: averages,
                color: "#3478f6",
            },
        ],
    });
}

document.addEventListener('DOMContentLoaded', async function () {

    async function fetchOffers() {
        const response = await fetch('data/parsed_comps.json');
        const data = await response.json();
        offers = data;
        filteredOffers = [...offers];
        totalPages = Math.ceil(filteredOffers.length / offersPerPage);
        displayOffers(currentPage);
        populateRoleFilter(offers);
    }

    await fetchOffers();

    // Initialize charts and stats
    setStatsStr(filteredOffers);
    plotHistogram(filteredOffers, 'total');
    mostOfferCompanies(filteredOffers);
    averageSalaryByCompany(filteredOffers);
    plotBoxPlot(filteredOffers, 'total', 'companyBoxPlot', 'company', new Set([]));
    plotBoxPlot(filteredOffers, 'total', 'yoeBucketBoxPlot', 'mapped_yoe', validYoeBucket);

    // Language selector
    const langSelect = document.getElementById('languageSelect');
    langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
    setLanguage(langSelect.value);

    // Pagination event listeners
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayOffers(currentPage);
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if ((currentPage * offersPerPage) < filteredOffers.length) {
            currentPage++;
            displayOffers(currentPage);
        }
    });

    // Page selection dropdown event listener
    document.getElementById('pageSelect').addEventListener('change', (event) => {
        currentPage = parseInt(event.target.value);
        displayOffers(currentPage);
    });

    document.getElementById('roleFilterSelect').addEventListener('change', (e) => {
        globalFilterState.roleFilter = e.target.value;
        filterOffers();
    });
    function filterOffers() {
        currentSort = { column: null, order: 'asc' };

        let tempFilteredOffers = [...offers];
        // Applying search filters if applicable

        if (globalFilterState.searchString.trim() !== '') {
            tempFilteredOffers = filterCompensationsByKeys(tempFilteredOffers, globalFilterState.searchString, GLOBAL_ALLOWED_FILTERS);
        }

        if (globalFilterState.yoeRange[0] !== null && globalFilterState.yoeRange[1] !== null) {
            tempFilteredOffers = tempFilteredOffers.filter(offer =>
                offer.yoe >= globalFilterState.yoeRange[0] && offer.yoe <= globalFilterState.yoeRange[1]
            );
        }

        if (globalFilterState.salaryRange[0] !== null && globalFilterState.salaryRange[1] !== null) {
            tempFilteredOffers = tempFilteredOffers.filter(offer =>
                offer.total >= globalFilterState.salaryRange[0] && offer.total <= globalFilterState.salaryRange[1]
            );
        }

        if (globalFilterState.includeInterviewExp) {
            tempFilteredOffers = tempFilteredOffers.filter(offer =>
                offer.interview_exp !== "N/A"
            );
        }

        if (globalFilterState.roleFilter) {
            tempFilteredOffers = tempFilteredOffers.filter(
                offer => offer.mapped_role === globalFilterState.roleFilter
            );
        }

        filteredOffers = tempFilteredOffers;
        totalPages = Math.ceil(filteredOffers.length / offersPerPage);
        currentPage = 1;

        // Update UI elements
        setStatsStr(filteredOffers);
        plotHistogram(filteredOffers, 'total');
        mostOfferCompanies(filteredOffers);
        averageSalaryByCompany(filteredOffers);
        plotBoxPlot(filteredOffers, 'total', 'companyBoxPlot', 'company', new Set([]));
        plotBoxPlot(filteredOffers, 'total', 'yoeBucketBoxPlot', 'mapped_yoe', validYoeBucket);
        displayOffers(currentPage);
    }


    function filterOffersByCompany(companyName) {
        globalFilterState.searchString = companyName;
        filterOffers(); // Call the unified filter function
    }

    function filterMenu(yoeRange, salaryRange, includeInterviewExp) {
        globalFilterState.yoeRange = yoeRange;
        globalFilterState.salaryRange = salaryRange;
        globalFilterState.includeInterviewExp = includeInterviewExp;

        filterOffers(); // Call the unified filter function
    }

    // Search button event listener
    document.getElementById('searchButton').addEventListener('click', () => {
        const searchInput = document.getElementById('searchInput').value;
        filterOffersByCompany(searchInput);
    });

    // Search button event listener
    document.getElementById('filter').addEventListener('click', () => {
        const yoeMin = document.getElementById('yoeMin').value;
        const yoeMax = document.getElementById('yoeMax').value;
        const salaryMin = document.getElementById('salaryMin').value;
        const salaryMax = document.getElementById('salaryMax').value;
        const includeInterviewExp = document.getElementById('interviewExpFilterCheckbox').checked;

        filterMenu([yoeMin, yoeMax], [salaryMin, salaryMax], includeInterviewExp);
    });


    document.getElementById('clearFiltersButton').addEventListener('click', () => {
        // Clear YOE range inputs
        document.getElementById('yoeMin').value = 0;
        document.getElementById('yoeMax').value = 30;

        // Clear salary range inputs
        document.getElementById('salaryMin').value = 1;
        document.getElementById('salaryMax').value = 200;

        // Uncheck interview experience filter checkbox, if it exists
        const interviewExpCheckbox = document.getElementById('interviewExpFilterCheckbox');
        if (interviewExpCheckbox) {
            interviewExpCheckbox.checked = false;
        }

        document.getElementById('roleFilterSelect').value = '';

        // Reset global filter state
        globalFilterState.yoeRange = [null, null];
        globalFilterState.salaryRange = [null, null];
        globalFilterState.includeInterviewExp = false;
        globalFilterState.roleFilter = '';

        // Apply filter function with cleared filters
        filterOffers();
    });

    // Search input "Enter" key event listener
    document.getElementById('searchInput').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const searchInput = document.getElementById('searchInput').value;
            filterOffersByCompany(searchInput);
        }
    });
});
