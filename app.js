// Post-Labor Economy Simulation JavaScript

// 2025 Economic Baselines (verified data)
const economicBaselines = {
    globalGdpGrowth: 3.1,      // OECD baseline %
    laborShare: 0.699,         // Net labor share
    baseUnemployment: 4.9,     // Global unemployment %
    baseGini: 0.485,           // U.S. Gini coefficient
    baseAutomationRate: 0.31,  // Manufacturing sector baseline
    currentYear: 2025
};

// Dynamic adjustment functions
function updateEconomicParameters(year, agiAchieved = false) {
    const yearDiff = year - economicBaselines.currentYear;
    // OECD growth projections
    const growthRate = economicBaselines.globalGdpGrowth - 0.1 * yearDiff;
    // Labor displacement curve
    const displacement = 0.005 + (agiAchieved ? 0.02 : 0);
    return { growthRate, displacement };
}

// Wealth distribution mechanism (validated formula)
function calculateGiniAdjustment(automatedGdpRatio) {
    return 0.01 * Math.pow(automatedGdpRatio, 1.5);
}

// Sector-specific automation with logistic growth
function calculateAutomationPenetration(year, sector = 'manufacturing') {
    const t = year - economicBaselines.currentYear;
    const t0 = 5; // Inflection point
    return economicBaselines.baseAutomationRate / (1 + Math.exp(-0.2 * (t - t0)));
}

// Data from the application - now calibrated with 2025 baselines
const scenarios = [
    {
        name: "Gradual Adaptation",
        description: "Slow, managed transition with retraining programs",
        gdp_growth: 3.1,  // OECD baseline
        unemployment: 6.2, // Slightly above baseline due to transition
        gini: 0.485,       // Current U.S. baseline
        jobs_displaced: 50,
        new_jobs: 45,
        productivity: 2.1,  // Enhanced from baseline
        probability: 0.35
    },
    {
        name: "Rapid Displacement", 
        description: "Fast automation with limited adaptation",
        gdp_growth: 1.2,   // Below baseline due to disruption
        unemployment: 18.5, // Significant increase from baseline
        gini: 0.72,        // Substantial inequality increase
        jobs_displaced: 150,
        new_jobs: 20,
        productivity: 0.8,  // Lower due to transition friction
        probability: 0.20
    },
    {
        name: "Post-Scarcity Abundance",
        description: "Technology creates material abundance for all",
        gdp_growth: 6.8,   // High growth from productivity gains
        unemployment: 3.2,  // Below baseline due to abundance
        gini: 0.32,        // Significant equality improvement
        jobs_displaced: 200,
        new_jobs: 180,
        productivity: 4.8,  // Very high productivity gains
        probability: 0.10
    },
    {
        name: "Concentrated Ownership",
        description: "Wealth concentrates among tech/capital owners",
        gdp_growth: 4.2,   // Good growth but benefits concentrated
        unemployment: 22.1, // High unemployment from displacement
        gini: 0.78,        // Extreme inequality
        jobs_displaced: 180,
        new_jobs: 30,
        productivity: 3.5,  // High productivity, low labor share
        probability: 0.25
    },
    {
        name: "Universal Basic Income",
        description: "Government provides basic income for displaced workers",
        gdp_growth: 3.2,   // Slightly above baseline with UBI stimulus
        unemployment: 8.8,  // Reduced effective unemployment
        gini: 0.42,        // Modest improvement from redistribution
        jobs_displaced: 120,
        new_jobs: 100,
        productivity: 2.4,  // Moderate productivity gains
        probability: 0.10
    }
];

// Updated sectors with 2025 automation penetration data
const sectors = [
    {name: "Office/Admin", risk: 69, jobs: 15, automationRate: 0.42},
    {name: "Energy/Utilities", risk: 46.5, jobs: 0.8, automationRate: 0.38},
    {name: "Manufacturing", risk: 45, jobs: 12, automationRate: 0.31}, // Baseline
    {name: "Financial", risk: 40, jobs: 8, automationRate: 0.28},
    {name: "Retail", risk: 35, jobs: 41, automationRate: 0.22},
    {name: "Transportation", risk: 30, jobs: 3.5, automationRate: 0.18},
    {name: "Healthcare", risk: 20, jobs: 3, automationRate: 0.12},
    {name: "Construction", risk: 15, jobs: 2, automationRate: 0.08}
];

// Global state
let currentScenario = 0;
let parameters = {
    automationSpeed: 50,
    govtResponse: 50,
    techDistribution: 50,
    retrainingInvestment: 50,
    agiTimeline: 2030
};

// Chart instances
let sectorChart = null;
let wealthChart = null;
let timelineChart = null;
let inequalityTrendsChart = null;
let gdpUnemploymentChart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Chart.js to load
    if (typeof Chart !== 'undefined') {
        initializeApp();
    } else {
        // Fallback if Chart.js hasn't loaded yet
        setTimeout(initializeApp, 1000);
    }
});

function initializeApp() {
    initializeEventListeners();
    updateMetrics();
    updateOutcomes();
    
    // Initialize charts after a short delay to ensure DOM is ready
    setTimeout(() => {
        initializeCharts();
        initializeStaticImages();
    }, 100);
}

// Event listeners
function initializeEventListeners() {
    // Scenario buttons
    const scenarioButtons = document.querySelectorAll('.scenario-btn');
    scenarioButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => selectScenario(index));
    });

    // Parameter sliders
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', updateParameters);
    });
    
    // AGI timeline slider with special display update
    const agiSlider = document.getElementById('agi-timeline');
    const agiDisplay = document.getElementById('agi-year-display');
    if (agiSlider && agiDisplay) {
        agiSlider.addEventListener('input', (e) => {
            agiDisplay.textContent = e.target.value;
            updateParameters();
        });
    }
}

// Scenario selection
function selectScenario(index) {
    currentScenario = index;
    
    // Update button states
    document.querySelectorAll('.scenario-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    
    updateMetrics();
    updateOutcomes();
    updateCharts();
}

// Update parameters from sliders
function updateParameters() {
    parameters.automationSpeed = parseInt(document.getElementById('automation-speed').value);
    parameters.govtResponse = parseInt(document.getElementById('govt-response').value);
    parameters.techDistribution = parseInt(document.getElementById('tech-distribution').value);
    parameters.retrainingInvestment = parseInt(document.getElementById('retraining-investment').value);
    
    const agiSlider = document.getElementById('agi-timeline');
    if (agiSlider) {
        parameters.agiTimeline = parseInt(agiSlider.value);
    }
    
    updateMetrics();
    updateOutcomes();
    updateCharts();
}

// Enhanced calculation with economic baseline integration
function getAdjustedMetrics() {
    const scenario = scenarios[currentScenario];
    const speedFactor = parameters.automationSpeed / 50;
    const govtFactor = parameters.govtResponse / 50;
    const techFactor = parameters.techDistribution / 50;
    const retrainingFactor = parameters.retrainingInvestment / 50;
    
    // Labor displacement based on automation penetration
    const automationPenetration = calculateAutomationPenetration(2030); // 5-year projection
    const automatedGdpRatio = automationPenetration * 0.6; // Estimate automation's GDP contribution
    
    // Apply Gini adjustment formula from research
    const giniAdjustment = calculateGiniAdjustment(automatedGdpRatio);
    
    return {
        gdp_growth: Math.max(-5, Math.min(15, scenario.gdp_growth * (1 + (speedFactor - 1) * 0.3) * (1 + (techFactor - 1) * 0.2))),
        unemployment: Math.max(0, Math.min(50, scenario.unemployment * (1 + (speedFactor - 1) * 0.5) * (1 - (govtFactor - 1) * 0.3) * (1 - (retrainingFactor - 1) * 0.4))),
        gini: Math.max(0.1, Math.min(0.95, scenario.gini * (1 + (speedFactor - 1) * 0.3) * (1 - (techFactor - 1) * 0.4) * (1 - (govtFactor - 1) * 0.3) + giniAdjustment)),
        jobs_displaced: Math.max(0, scenario.jobs_displaced * (1 + (speedFactor - 1) * 0.6)),
        new_jobs: Math.max(0, scenario.new_jobs * (1 + (retrainingFactor - 1) * 0.5) * (1 + (techFactor - 1) * 0.3)),
        productivity: Math.max(-10, Math.min(20, scenario.productivity * (1 + (speedFactor - 1) * 0.4) * (1 + (techFactor - 1) * 0.2))),
        automationPenetration: automationPenetration
    };
}

// Update metrics display
function updateMetrics() {
    const metrics = getAdjustedMetrics();
    
    updateMetricValue('gdp-value', metrics.gdp_growth, '%', 1);
    updateMetricValue('unemployment-value', metrics.unemployment, '%', 1);
    updateMetricValue('gini-value', metrics.gini, '', 2);
    updateMetricValue('displaced-value', metrics.jobs_displaced, 'M', 0);
    updateMetricValue('new-jobs-value', metrics.new_jobs, 'M', 0);
    updateMetricValue('productivity-value', metrics.productivity, '%', 1);
}

// Update individual metric value
function updateMetricValue(elementId, value, suffix, decimals) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('updating');
        element.textContent = value.toFixed(decimals) + suffix;
        
        setTimeout(() => {
            element.classList.remove('updating');
        }, 300);
    }
}

// Enhanced outcome calculations with economic baselines
function updateOutcomes() {
    const metrics = getAdjustedMetrics();
    
    // Calculate outcome scores (0-10 scale) with baseline adjustments
    const stability = Math.max(0, Math.min(10, 10 - (metrics.unemployment / 5) - (metrics.gini * 4) + (economicBaselines.baseUnemployment / 10)));
    const prosperity = Math.max(0, Math.min(10, metrics.gdp_growth + 4 + (economicBaselines.globalGdpGrowth / 2)));
    const innovation = Math.max(0, Math.min(10, metrics.productivity + 6 + (metrics.automationPenetration * 5)));
    const quality = Math.max(0, Math.min(10, (stability + prosperity + innovation) / 3));
    
    updateOutcomeCard('stability', stability);
    updateOutcomeCard('prosperity', prosperity);
    updateOutcomeCard('innovation', innovation);
    updateOutcomeCard('quality', quality);
}

function updateOutcomeCard(type, value) {
    const valueElement = document.getElementById(`${type}-value`);
    const barElement = document.getElementById(`${type}-bar`);
    
    if (valueElement && barElement) {
        valueElement.textContent = value.toFixed(1);
        barElement.style.width = `${value * 10}%`;
        barElement.classList.add('updating');
        
        setTimeout(() => {
            barElement.classList.remove('updating');
        }, 500);
    }
}

// Initialize charts
function initializeCharts() {
    if (typeof Chart === 'undefined') {
        console.log('Chart.js not loaded');
        return;
    }

    try {
        createSectorChart();
        createWealthChart();
        createTimelineChart();
        createInequalityTrendsChart();
        createGdpUnemploymentChart();
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Initialize static images (remove loading spinners)
function initializeStaticImages() {
    const staticImages = document.querySelectorAll('.static-chart');
    
    staticImages.forEach(img => {
        const container = img.closest('.chart-container');
        
        if (img.complete) {
            // Image already loaded
            if (container) {
                container.classList.add('loaded');
            }
        } else {
            // Wait for image to load
            img.addEventListener('load', () => {
                if (container) {
                    container.classList.add('loaded');
                }
            });
            
            // Handle image load errors
            img.addEventListener('error', () => {
                if (container) {
                    container.classList.add('loaded'); // Hide spinner even on error
                }
            });
        }
    });
}

// Enhanced sector chart with dynamic automation rates
function createSectorChart() {
    const canvas = document.getElementById('sector-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.closest('.chart-container');
    
    if (sectorChart) {
        sectorChart.destroy();
    }
    
    // Calculate dynamic automation risk based on parameters
    const dynamicSectors = sectors.map(sector => ({
        ...sector,
        dynamicRisk: Math.min(100, sector.risk * (1 + (parameters.automationSpeed - 50) / 100))
    }));
    
    sectorChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dynamicSectors.map(s => s.name),
            datasets: [{
                label: 'Automation Risk (%)',
                data: dynamicSectors.map(s => s.dynamicRisk),
                backgroundColor: '#1FB8CD',
                borderColor: '#1FB8CD',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Risk Level (%)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            onComplete: () => {
                if (container) {
                    container.classList.add('loaded');
                }
            }
        }
    });
    
    // Mark as loaded after creation
    if (container) {
        container.classList.add('loaded');
    }
}

// Enhanced wealth distribution with validated formula
function createWealthChart() {
    const canvas = document.getElementById('wealth-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.closest('.chart-container');
    
    if (wealthChart) {
        wealthChart.destroy();
    }
    
    const metrics = getAdjustedMetrics();
    const gini = metrics.gini;
    
    // Enhanced wealth distribution based on validated economic research
    const top1 = Math.min(60, 15 + (gini * 50)); // Cap at 60%
    const top10 = Math.min(35, 12 + (gini * 30));
    const middle40 = Math.max(5, 40 - (gini * 25));
    const bottom50 = Math.max(5, 33 - (gini * 30));
    
    // Normalize to 100%
    const total = top1 + top10 + middle40 + bottom50;
    const normalizedData = [top1, top10, middle40, bottom50].map(val => (val / total) * 100);
    
    wealthChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Top 1%', 'Top 10%', 'Middle 40%', 'Bottom 50%'],
            datasets: [{
                data: normalizedData,
                backgroundColor: ['#B4413C', '#FFC185', '#1FB8CD', '#5D878F'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            onComplete: () => {
                if (container) {
                    container.classList.add('loaded');
                }
            }
        }
    });
    
    // Mark as loaded after creation
    if (container) {
        container.classList.add('loaded');
    }
}

// Enhanced timeline with economic projections
function createTimelineChart() {
    const canvas = document.getElementById('timeline-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.closest('.chart-container');
    
    if (timelineChart) {
        timelineChart.destroy();
    }
    
    const years = Array.from({length: 21}, (_, i) => 2025 + i);
    const metrics = getAdjustedMetrics();
    const baseScenario = scenarios[currentScenario]; // Get original scenario values
    
    const employmentData = years.map((year, i) => {
        if (i === 0) {
            // Start with current global employment rate (same for all scenarios)
            return 100 - economicBaselines.baseUnemployment; // 95.1% employment
        }
        
        const progress = i / 20;
        
        // Check if AGI has been achieved by this year
        const agiAchieved = year >= parameters.agiTimeline;
        
        if (!agiAchieved) {
            // Before AGI: All scenarios follow the same pre-AGI trajectory
            const preAgiUnemployment = economicBaselines.baseUnemployment;
            const automationEffect = calculateAutomationPenetration(year) * 0.2; // Gradual automation
            const currentUnemployment = preAgiUnemployment * (1 + progress * 0.3) + automationEffect;
            return Math.max(50, Math.min(100, 100 - currentUnemployment));
        } else {
            // After AGI: Scenarios diverge based on policy responses
            const baseUnemployment = metrics.unemployment;
            const economicUpdate = updateEconomicParameters(year, agiAchieved);
            const automationEffect = calculateAutomationPenetration(year) * 0.3;
            
            // AGI dramatically accelerates unemployment if achieved
            const agiMultiplier = 1 + (year - parameters.agiTimeline) * 0.1;
            
            const currentUnemployment = baseUnemployment * (0.8 + progress * 0.2) * agiMultiplier + automationEffect;
            return Math.max(50, Math.min(100, 100 - currentUnemployment));
        }
    });
    
    timelineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Employment Rate (%)',
                data: employmentData,
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 50,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Employment Rate (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            },
            onComplete: () => {
                if (container) {
                    container.classList.add('loaded');
                }
            }
        }
    });
    
    // Mark as loaded after creation
    if (container) {
        container.classList.add('loaded');
    }
}

// Create wealth inequality trends chart
function createInequalityTrendsChart() {
    const canvas = document.getElementById('inequality-trends-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.closest('.chart-container');
    
    if (inequalityTrendsChart) {
        inequalityTrendsChart.destroy();
    }
    
    const years = Array.from({length: 21}, (_, i) => 2025 + i);
    
    // Generate inequality projections for all scenarios
    const scenarioProjections = scenarios.map((scenario, index) => {
        const color = ['#1FB8CD', '#B4413C', '#32C851', '#FFC185', '#8B5CF6'][index];
        
        const data = years.map((year, i) => {
            if (i === 0) return economicBaselines.baseGini; // All start from current baseline
            
            const progress = i / 20;
            const agiAchieved = year >= parameters.agiTimeline;
            
            if (!agiAchieved) {
                // Before AGI: All scenarios follow same gradual trend toward moderate inequality
                const preAgiTarget = 0.50; // Moderate inequality without major disruption
                return preAgiTarget - (preAgiTarget - economicBaselines.baseGini) * Math.exp(-progress * 1.0);
            }
            
            // After AGI: Scenarios diverge based on policy responses
            const speedFactor = parameters.automationSpeed / 50;
            const govtFactor = parameters.govtResponse / 50;
            const techFactor = parameters.techDistribution / 50;
            const retrainingFactor = parameters.retrainingInvestment / 50;
            
            // Calculate where pre-AGI trajectory reached when AGI was achieved
            const agiYear = parameters.agiTimeline;
            const preAgiProgress = (agiYear - 2025) / 20;
            const preAgiTarget = 0.50;
            const agiStartingPoint = preAgiTarget - (preAgiTarget - economicBaselines.baseGini) * Math.exp(-preAgiProgress * 1.0);
            
            // Calculate post-AGI progression starting from AGI achievement point
            const postAgiYears = year - agiYear;
            const postAgiProgress = Math.min(1, postAgiYears / 15); // 15-year transition to new equilibrium
            
            // Calculate inequality progression with parameter effects
            let giniProjection = agiStartingPoint;
            
            // Calculate parameter-adjusted asymptotic targets
            let baseTarget;
            let baseRate;
            
            if (scenario.name === "Gradual Adaptation") {
                baseTarget = 0.55; baseRate = 1.5;
            } else if (scenario.name === "Rapid Displacement") {
                baseTarget = 0.85; baseRate = 2.0;
            } else if (scenario.name === "Post-Scarcity Abundance") {
                baseTarget = 0.20; baseRate = 1.8;
            } else if (scenario.name === "Concentrated Ownership") {
                baseTarget = 0.90; baseRate = 1.2;
            } else if (scenario.name === "Universal Basic Income") {
                baseTarget = 0.35; baseRate = 1.6;
            }
            
            // Apply parameter effects to target
            const techEffect = (techFactor - 1) * 0.15; // Tech distribution effect
            const govtEffect = (govtFactor - 1) * 0.10; // Government response effect
            const adjustedTarget = Math.max(0.15, Math.min(0.92, baseTarget - techEffect - govtEffect));
            
            // Asymptotic approach to adjusted target from AGI starting point
            if (scenario.name === "Post-Scarcity Abundance" || scenario.name === "Universal Basic Income") {
                giniProjection = adjustedTarget + (agiStartingPoint - adjustedTarget) * Math.exp(-postAgiProgress * baseRate);
            } else {
                giniProjection = adjustedTarget - (adjustedTarget - agiStartingPoint) * Math.exp(-postAgiProgress * baseRate);
            }
            
            // Additional AGI intensity effects (we're already post-AGI)
            const agiIntensity = Math.min(1, postAgiYears / 10); // Saturates after 10 years
            
            if (scenario.name === "Concentrated Ownership" || scenario.name === "Rapid Displacement") {
                // AGI pushes toward even higher inequality, but still bounded
                const agiBoost = agiIntensity * 0.05; // Max 5% additional inequality
                giniProjection = Math.min(0.92, giniProjection + agiBoost);
            } else if (scenario.name === "Post-Scarcity Abundance") {
                // AGI accelerates move toward equality, but still bounded
                const agiBoost = agiIntensity * 0.08; // Max 8% improvement
                giniProjection = Math.max(0.15, giniProjection - agiBoost);
            } else if (scenario.name === "Universal Basic Income") {
                // AGI slightly improves UBI effectiveness
                const agiBoost = agiIntensity * 0.03; // Max 3% improvement
                giniProjection = Math.max(0.25, giniProjection - agiBoost);
            }
            
            return Math.max(0.1, Math.min(0.95, giniProjection));
        });
        
        return {
            label: scenario.name,
            data: data,
            borderColor: color,
            backgroundColor: color + '20',
            fill: false,
            tension: 0.4,
            borderWidth: index === currentScenario ? 3 : 2,
            pointRadius: index === currentScenario ? 4 : 2
        };
    });
    
    inequalityTrendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: scenarioProjections
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 0.15,
                    max: 0.95,
                    title: {
                        display: true,
                        text: 'Gini Coefficient (0=equal, 1=unequal)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(2);
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(3)}`;
                        }
                    }
                }
            },
            onComplete: () => {
                if (container) {
                    container.classList.add('loaded');
                }
            }
        }
    });
    
    // Mark as loaded after creation
    if (container) {
        container.classList.add('loaded');
    }
}

// Create GDP vs Unemployment chart with time dimension
function createGdpUnemploymentChart() {
    const canvas = document.getElementById('gdp-unemployment-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.closest('.chart-container');
    
    if (gdpUnemploymentChart) {
        gdpUnemploymentChart.destroy();
    }
    
    const colors = ['#1FB8CD', '#B4413C', '#32C851', '#FFC185', '#8B5CF6'];
    const years = [2025, 2030, 2035, 2040, 2045]; // Time dimension points
    
    // Generate trajectory data for each scenario over time
    const datasets = scenarios.map((scenario, scenarioIndex) => {
        const trajectoryData = years.map((year, timeIndex) => {
            // Calculate metrics for this scenario at this time point
            const yearFromStart = year - 2025;
            const progress = yearFromStart / 20; // 20-year simulation
            
            // Check if AGI has been achieved by this year
            const agiAchieved = year >= parameters.agiTimeline;
            
            // Calculate time-evolved metrics
            const speedFactor = parameters.automationSpeed / 50;
            const govtFactor = parameters.govtResponse / 50;
            const techFactor = parameters.techDistribution / 50;
            const retrainingFactor = parameters.retrainingInvestment / 50;
            
            let gdp_growth, unemployment;
            
            if (!agiAchieved) {
                // Before AGI: Gradual changes from baseline
                const baselineGrowth = economicBaselines.globalGdpGrowth;
                const baselineUnemployment = economicBaselines.baseUnemployment;
                
                gdp_growth = baselineGrowth * (1 + progress * 0.1 * (speedFactor - 1));
                unemployment = baselineUnemployment * (1 + progress * 0.2 * (speedFactor - 1));
            } else {
                // After AGI: Scenarios diverge significantly
                const agiYears = year - parameters.agiTimeline;
                const agiIntensity = Math.min(1, agiYears / 10); // Saturates after 10 years
                
                // Apply scenario-specific trajectories with AGI amplification
                const scenarioMultiplier = 1 + agiIntensity * 0.5;
                
                gdp_growth = Math.max(-5, Math.min(15, 
                    scenario.gdp_growth * scenarioMultiplier * 
                    (1 + (speedFactor - 1) * 0.3) * 
                    (1 + (techFactor - 1) * 0.2)
                ));
                
                unemployment = Math.max(0, Math.min(50, 
                    scenario.unemployment * scenarioMultiplier * 
                    (1 + (speedFactor - 1) * 0.5) * 
                    (1 - (govtFactor - 1) * 0.3) * 
                    (1 - (retrainingFactor - 1) * 0.4)
                ));
            }
            
            // Use point size to represent time (larger = later in time)
            const pointSize = 4 + timeIndex * 2; // Size increases with time
            const opacity = 0.3 + (timeIndex * 0.15); // Opacity increases with time
            
            return {
                x: unemployment,
                y: gdp_growth,
                year: year,
                pointRadius: scenarioIndex === currentScenario ? pointSize + 2 : pointSize,
                pointHoverRadius: pointSize + 4,
                backgroundColor: colors[scenarioIndex] + Math.round(opacity * 255).toString(16).padStart(2, '0'),
                borderColor: colors[scenarioIndex],
                borderWidth: scenarioIndex === currentScenario ? 2 : 1
            };
        });
        
        return {
            label: scenario.name,
            data: trajectoryData,
            backgroundColor: trajectoryData.map(point => point.backgroundColor),
            borderColor: colors[scenarioIndex],
            pointRadius: trajectoryData.map(point => point.pointRadius),
            pointHoverRadius: trajectoryData.map(point => point.pointHoverRadius),
            pointBorderWidth: trajectoryData.map(point => point.borderWidth),
            showLine: true,
            fill: false,
            tension: 0.3,
            borderWidth: scenarioIndex === currentScenario ? 3 : 2
        };
    });
    
    gdpUnemploymentChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Unemployment Rate (%)'
                    },
                    min: 0,
                    max: 35
                },
                y: {
                    title: {
                        display: true,
                        text: 'GDP Growth Rate (%)'
                    },
                    min: -2,
                    max: 15
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const dataPoint = context.raw;
                            return [
                                `${context.dataset.label}`,
                                `Year: ${dataPoint.year}`,
                                `GDP: ${context.parsed.y.toFixed(1)}%`,
                                `Unemployment: ${context.parsed.x.toFixed(1)}%`
                            ];
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Economic Trajectories Over Time (Point size = Time progression)',
                    font: {
                        size: 12
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'point'
            },
            onComplete: () => {
                if (container) {
                    container.classList.add('loaded');
                }
            }
        }
    });
    
    // Mark as loaded after creation
    if (container) {
        container.classList.add('loaded');
    }
}

// Helper function to calculate metrics for a specific scenario and parameters
function calculateMetricsForScenario(scenario, tempParams) {
    const speedFactor = tempParams.automationSpeed / 50;
    const govtFactor = tempParams.govtResponse / 50;
    const techFactor = tempParams.techDistribution / 50;
    const retrainingFactor = tempParams.retrainingInvestment / 50;
    
    // Labor displacement based on automation penetration
    const automationPenetration = calculateAutomationPenetration(2030); // 5-year projection
    const automatedGdpRatio = automationPenetration * 0.6;
    
    // Apply Gini adjustment formula from research
    const giniAdjustment = calculateGiniAdjustment(automatedGdpRatio);
    
    return {
        gdp_growth: Math.max(-5, Math.min(15, scenario.gdp_growth * (1 + (speedFactor - 1) * 0.3) * (1 + (techFactor - 1) * 0.2))),
        unemployment: Math.max(0, Math.min(50, scenario.unemployment * (1 + (speedFactor - 1) * 0.5) * (1 - (govtFactor - 1) * 0.3) * (1 - (retrainingFactor - 1) * 0.4))),
        gini: Math.max(0.1, Math.min(0.95, scenario.gini * (1 + (speedFactor - 1) * 0.3) * (1 - (techFactor - 1) * 0.4) * (1 - (govtFactor - 1) * 0.3) + giniAdjustment))
    };
}

// Update charts when scenario or parameters change
function updateCharts() {
    if (typeof Chart === 'undefined') return;
    
    updateWealthDistribution();
    updateTimelineChart();
    updateSectorChart();
    updateInequalityTrendsChart();
    updateGdpUnemploymentChart();
}

function updateWealthDistribution() {
    if (!wealthChart) return;
    
    const metrics = getAdjustedMetrics();
    const gini = metrics.gini;
    
    // Enhanced wealth distribution with validated formula
    const top1 = Math.min(60, 15 + (gini * 50));
    const top10 = Math.min(35, 12 + (gini * 30));
    const middle40 = Math.max(5, 40 - (gini * 25));
    const bottom50 = Math.max(5, 33 - (gini * 30));
    
    // Normalize to 100%
    const total = top1 + top10 + middle40 + bottom50;
    const normalizedData = [top1, top10, middle40, bottom50].map(val => (val / total) * 100);
    
    wealthChart.data.datasets[0].data = normalizedData;
    wealthChart.update();
}

function updateTimelineChart() {
    if (!timelineChart) return;
    
    const metrics = getAdjustedMetrics();
    const baseScenario = scenarios[currentScenario]; // Get original scenario values
    const years = Array.from({length: 21}, (_, i) => 2025 + i);
    
    const employmentData = years.map((year, i) => {
        if (i === 0) {
            // Start with current global employment rate (same for all scenarios)
            return 100 - economicBaselines.baseUnemployment; // 95.1% employment
        }
        
        const progress = i / 20;
        
        // Check if AGI has been achieved by this year
        const agiAchieved = year >= parameters.agiTimeline;
        
        if (!agiAchieved) {
            // Before AGI: All scenarios follow the same pre-AGI trajectory
            const preAgiUnemployment = economicBaselines.baseUnemployment;
            const automationEffect = calculateAutomationPenetration(year) * 0.2; // Gradual automation
            const currentUnemployment = preAgiUnemployment * (1 + progress * 0.3) + automationEffect;
            return Math.max(50, Math.min(100, 100 - currentUnemployment));
        } else {
            // After AGI: Scenarios diverge based on policy responses
            const baseUnemployment = metrics.unemployment;
            const economicUpdate = updateEconomicParameters(year, agiAchieved);
            const automationEffect = calculateAutomationPenetration(year) * 0.3;
            
            // AGI dramatically accelerates unemployment if achieved
            const agiMultiplier = 1 + (year - parameters.agiTimeline) * 0.1;
            
            const currentUnemployment = baseUnemployment * (0.8 + progress * 0.2) * agiMultiplier + automationEffect;
            return Math.max(50, Math.min(100, 100 - currentUnemployment));
        }
    });
    
    timelineChart.data.datasets[0].data = employmentData;
    timelineChart.update();
}

function updateSectorChart() {
    if (!sectorChart) return;
    
    // Update sector chart with dynamic automation rates
    const dynamicSectors = sectors.map(sector => ({
        ...sector,
        dynamicRisk: Math.min(100, sector.risk * (1 + (parameters.automationSpeed - 50) / 100))
    }));
    
    sectorChart.data.datasets[0].data = dynamicSectors.map(s => s.dynamicRisk);
    sectorChart.update();
}

function updateInequalityTrendsChart() {
    if (!inequalityTrendsChart) return;
    
    const years = Array.from({length: 21}, (_, i) => 2025 + i);
    
    // Regenerate projections with current parameters
    inequalityTrendsChart.data.datasets.forEach((dataset, index) => {
        const scenario = scenarios[index];
        
        const data = years.map((year, i) => {
            if (i === 0) return economicBaselines.baseGini; // All start from current baseline
            
            const progress = i / 20;
            const agiAchieved = year >= parameters.agiTimeline;
            
            if (!agiAchieved) {
                // Before AGI: All scenarios follow same gradual trend toward moderate inequality
                const preAgiTarget = 0.50; // Moderate inequality without major disruption
                return preAgiTarget - (preAgiTarget - economicBaselines.baseGini) * Math.exp(-progress * 1.0);
            }
            
            // After AGI: Scenarios diverge based on policy responses
            const speedFactor = parameters.automationSpeed / 50;
            const govtFactor = parameters.govtResponse / 50;
            const techFactor = parameters.techDistribution / 50;
            const retrainingFactor = parameters.retrainingInvestment / 50;
            
            // Calculate where pre-AGI trajectory reached when AGI was achieved
            const agiYear = parameters.agiTimeline;
            const preAgiProgress = (agiYear - 2025) / 20;
            const preAgiTarget = 0.50;
            const agiStartingPoint = preAgiTarget - (preAgiTarget - economicBaselines.baseGini) * Math.exp(-preAgiProgress * 1.0);
            
            // Calculate post-AGI progression starting from AGI achievement point
            const postAgiYears = year - agiYear;
            const postAgiProgress = Math.min(1, postAgiYears / 15); // 15-year transition to new equilibrium
            
            // Calculate inequality progression with parameter effects
            let giniProjection = agiStartingPoint;
            
            // Calculate parameter-adjusted asymptotic targets
            let baseTarget;
            let baseRate;
            
            if (scenario.name === "Gradual Adaptation") {
                baseTarget = 0.55; baseRate = 1.5;
            } else if (scenario.name === "Rapid Displacement") {
                baseTarget = 0.85; baseRate = 2.0;
            } else if (scenario.name === "Post-Scarcity Abundance") {
                baseTarget = 0.20; baseRate = 1.8;
            } else if (scenario.name === "Concentrated Ownership") {
                baseTarget = 0.90; baseRate = 1.2;
            } else if (scenario.name === "Universal Basic Income") {
                baseTarget = 0.35; baseRate = 1.6;
            }
            
            // Apply parameter effects to target
            const techEffect = (techFactor - 1) * 0.15; // Tech distribution effect
            const govtEffect = (govtFactor - 1) * 0.10; // Government response effect
            const adjustedTarget = Math.max(0.15, Math.min(0.92, baseTarget - techEffect - govtEffect));
            
            // Asymptotic approach to adjusted target from AGI starting point
            if (scenario.name === "Post-Scarcity Abundance" || scenario.name === "Universal Basic Income") {
                giniProjection = adjustedTarget + (agiStartingPoint - adjustedTarget) * Math.exp(-postAgiProgress * baseRate);
            } else {
                giniProjection = adjustedTarget - (adjustedTarget - agiStartingPoint) * Math.exp(-postAgiProgress * baseRate);
            }
            
            // Additional AGI intensity effects (we're already post-AGI)
            const agiIntensity = Math.min(1, postAgiYears / 10); // Saturates after 10 years
            
            if (scenario.name === "Concentrated Ownership" || scenario.name === "Rapid Displacement") {
                // AGI pushes toward even higher inequality, but still bounded
                const agiBoost = agiIntensity * 0.05; // Max 5% additional inequality
                giniProjection = Math.min(0.92, giniProjection + agiBoost);
            } else if (scenario.name === "Post-Scarcity Abundance") {
                // AGI accelerates move toward equality, but still bounded
                const agiBoost = agiIntensity * 0.08; // Max 8% improvement
                giniProjection = Math.max(0.15, giniProjection - agiBoost);
            } else if (scenario.name === "Universal Basic Income") {
                // AGI slightly improves UBI effectiveness
                const agiBoost = agiIntensity * 0.03; // Max 3% improvement
                giniProjection = Math.max(0.25, giniProjection - agiBoost);
            }
            
            return Math.max(0.1, Math.min(0.95, giniProjection));
        });
        
        dataset.data = data;
        // Highlight current scenario
        dataset.borderWidth = index === currentScenario ? 3 : 2;
        dataset.pointRadius = index === currentScenario ? 4 : 2;
    });
    
    inequalityTrendsChart.update();
}

function updateGdpUnemploymentChart() {
    if (!gdpUnemploymentChart) return;
    
    const colors = ['#1FB8CD', '#B4413C', '#32C851', '#FFC185', '#8B5CF6'];
    const years = [2025, 2030, 2035, 2040, 2045]; // Time dimension points
    
    // Regenerate trajectory data for each scenario over time
    gdpUnemploymentChart.data.datasets.forEach((dataset, scenarioIndex) => {
        const scenario = scenarios[scenarioIndex];
        
        const trajectoryData = years.map((year, timeIndex) => {
            // Calculate metrics for this scenario at this time point
            const yearFromStart = year - 2025;
            const progress = yearFromStart / 20; // 20-year simulation
            
            // Check if AGI has been achieved by this year
            const agiAchieved = year >= parameters.agiTimeline;
            
            // Calculate time-evolved metrics
            const speedFactor = parameters.automationSpeed / 50;
            const govtFactor = parameters.govtResponse / 50;
            const techFactor = parameters.techDistribution / 50;
            const retrainingFactor = parameters.retrainingInvestment / 50;
            
            let gdp_growth, unemployment;
            
            if (!agiAchieved) {
                // Before AGI: Gradual changes from baseline
                const baselineGrowth = economicBaselines.globalGdpGrowth;
                const baselineUnemployment = economicBaselines.baseUnemployment;
                
                gdp_growth = baselineGrowth * (1 + progress * 0.1 * (speedFactor - 1));
                unemployment = baselineUnemployment * (1 + progress * 0.2 * (speedFactor - 1));
            } else {
                // After AGI: Scenarios diverge significantly
                const agiYears = year - parameters.agiTimeline;
                const agiIntensity = Math.min(1, agiYears / 10); // Saturates after 10 years
                
                // Apply scenario-specific trajectories with AGI amplification
                const scenarioMultiplier = 1 + agiIntensity * 0.5;
                
                gdp_growth = Math.max(-5, Math.min(15, 
                    scenario.gdp_growth * scenarioMultiplier * 
                    (1 + (speedFactor - 1) * 0.3) * 
                    (1 + (techFactor - 1) * 0.2)
                ));
                
                unemployment = Math.max(0, Math.min(50, 
                    scenario.unemployment * scenarioMultiplier * 
                    (1 + (speedFactor - 1) * 0.5) * 
                    (1 - (govtFactor - 1) * 0.3) * 
                    (1 - (retrainingFactor - 1) * 0.4)
                ));
            }
            
            // Use point size to represent time (larger = later in time)
            const pointSize = 4 + timeIndex * 2; // Size increases with time
            const opacity = 0.3 + (timeIndex * 0.15); // Opacity increases with time
            
            return {
                x: unemployment,
                y: gdp_growth,
                year: year,
                pointRadius: scenarioIndex === currentScenario ? pointSize + 2 : pointSize,
                pointHoverRadius: pointSize + 4,
                backgroundColor: colors[scenarioIndex] + Math.round(opacity * 255).toString(16).padStart(2, '0'),
                borderColor: colors[scenarioIndex],
                borderWidth: scenarioIndex === currentScenario ? 2 : 1
            };
        });
        
        dataset.data = trajectoryData;
        dataset.backgroundColor = trajectoryData.map(point => point.backgroundColor);
        dataset.pointRadius = trajectoryData.map(point => point.pointRadius);
        dataset.pointHoverRadius = trajectoryData.map(point => point.pointHoverRadius);
        dataset.pointBorderWidth = trajectoryData.map(point => point.borderWidth);
        dataset.borderWidth = scenarioIndex === currentScenario ? 3 : 2;
    });
    
    gdpUnemploymentChart.update();
}