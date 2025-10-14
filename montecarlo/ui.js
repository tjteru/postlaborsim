// UI Event Handlers and Application Logic

        // Application data
        const simulationData = {
            scenarios: {
                current: { name: 'Current', adoption_rate: 23, displacement_rate: 15, productivity_multiplier: 1.0 },
                conservative: { name: 'Conservative', adoption_rate: 15, displacement_rate: 10, productivity_multiplier: 0.8 },
                aggressive: { name: 'Aggressive', adoption_rate: 45, displacement_rate: 25, productivity_multiplier: 1.5 }
            },
            chartColors: {
                gdp: '#2E8B57',
                employment: '#DC143C',
                productivity: '#4169E1',
                sectors: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B']
            }
        };

        // Global variables
        let simulator = new MonteCarloSimulator();
        let currentCharts = {};
        let debounceTimer = null;
        let savedScenarios = {};

        // Initialize the application with step-by-step verification
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 Initializing AI Economic Impact Simulator...');
            console.log('📋 Checking DOM elements...');
            
            // Verify critical elements exist
            const criticalElements = [
                'runSimulation',
                'adoptionRate', 'adoptionValue',
                'tfpRate', 'tfpValue', 
                'displacementRate', 'displacementValue',
                'iterations', 'iterationsValue',
                'productivityMultiplier', 'productivityValue',
                'demandElasticity', 'elasticityValue',
                'timeHorizon', 'horizonValue'
            ];
            
            const missingElements = criticalElements.filter(id => !document.getElementById(id));
            if (missingElements.length > 0) {
                console.error('❌ Missing critical elements:', missingElements);
            } else {
                console.log('✅ All critical elements found');
            }
            
            try {
                console.log('📑 Initializing tabs...');
                initializeTabs();
                console.log('✅ Tabs initialized');
                
                console.log('🎛️ Initializing sliders...');
                initializeSliders();
                console.log('✅ Sliders initialized');
                
                console.log('🔧 Setting up event listeners...');
                setupEventListeners();
                console.log('✅ Event listeners setup');
                
                console.log('📊 Initializing charts...');
                initializeCharts();
                console.log('✅ Charts initialized');
                
                console.log('🎬 Running initial simulation...');
                runInitialSimulation();
                console.log('✅ Initial simulation triggered');
                
                console.log('🎉 Initialization complete! Try moving the sliders and clicking Run Simulation.');
                
            } catch (error) {
                console.error('❌ Initialization error:', error);
                console.error('Stack trace:', error.stack);
                alert(`Initialization Error: ${error.message}\n\nCheck the console for more details.`);
            }
        });

        // Setup event listeners
        function setupEventListeners() {
            console.log('🔧 Setting up event listeners...');
            
            // Run simulation button with immediate feedback
            const runBtn = document.getElementById('runSimulation');
            if (runBtn) {
                runBtn.addEventListener('click', function() {
                    console.log('▶️ Run simulation button clicked');
                    this.textContent = 'Running...';
                    this.disabled = true;
                    
                    setTimeout(() => {
                        runSimulation();
                        this.textContent = 'Run Simulation';
                        this.disabled = false;
                    }, 100);
                });
                console.log('✅ Run button event listener attached');
            } else {
                console.error('❌ Run simulation button not found!');
            }
            
            // Reset defaults button
            const resetBtn = document.getElementById('resetDefaults');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    console.log('🔄 Reset defaults button clicked');
                    resetToDefaults();
                });
                console.log('✅ Reset button event listener attached');
            }
            
            // Parameter change events - immediate display update + debounced simulation
            const sliders = document.querySelectorAll('.slider');
            console.log(`📊 Found ${sliders.length} sliders`);
            
            if (sliders.length === 0) {
                console.error('❌ No sliders found! Check HTML structure.');
            }
            
            sliders.forEach(slider => {
                console.log(`🎛️ Setting up slider: ${slider.id}`);
                
                // Immediate display update
                slider.addEventListener('input', function() {
                    console.log(`🎛️ Slider ${this.id} changed to: ${this.value}`);
                    updateSliderDisplay(this);
                });
                
                // Also trigger on change event for better compatibility
                slider.addEventListener('change', function() {
                    console.log(`🎛️ Slider ${this.id} change event: ${this.value}`);
                    updateSliderDisplay(this);
                });
                
                // Debounced simulation trigger
                slider.addEventListener('input', debounceSimulation);
                
                // Set initial display value
                updateSliderDisplay(slider);
            });
            
            // Sector filter
            const sectorFilter = document.getElementById('sectorFilter');
            if (sectorFilter) {
                sectorFilter.addEventListener('input', filterSectors);
            }
            
            console.log('✅ Event listeners setup complete');
        }

        // Tab functionality
        function initializeTabs() {
            console.log('🗂️ Initializing tab functionality...');
            
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabPanels = document.querySelectorAll('.tab-panel');
            
            console.log(`Found ${tabButtons.length} tab buttons and ${tabPanels.length} tab panels`);

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const targetTab = button.dataset.tab;
                    console.log(`🔄 Switching to tab: ${targetTab}`);
                    
                    // Remove active class from all buttons and panels
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabPanels.forEach(panel => panel.classList.remove('active'));
                    
                    // Add active class to clicked button and corresponding panel
                    button.classList.add('active');
                    const targetPanel = document.getElementById(targetTab);
                    if (targetPanel) {
                        targetPanel.classList.add('active');
                        console.log(`✅ Tab ${targetTab} activated`);
                        
                        // Update charts when tab becomes visible
                        setTimeout(() => updateChartsForTab(targetTab), 100);
                    } else {
                        console.error(`❌ Tab panel not found: ${targetTab}`);
                    }
                });
            });
            
            console.log('✅ Tab functionality initialized');
        }

        // Slider functionality with comprehensive testing
        function initializeSliders() {
            console.log('🎛️ Initializing sliders...');
            
            const sliderConfigs = [
                { id: 'adoptionRate', display: 'adoptionValue', suffix: '%' },
                { id: 'tfpRate', display: 'tfpValue', suffix: '%' },
                { id: 'displacementRate', display: 'displacementValue', suffix: '%' },
                { id: 'iterations', display: 'iterationsValue', suffix: '' },
                { id: 'productivityMultiplier', display: 'productivityValue', suffix: 'x' },
                { id: 'demandElasticity', display: 'elasticityValue', suffix: '' },
                { id: 'timeHorizon', display: 'horizonValue', suffix: ' years' }
            ];

            sliderConfigs.forEach(config => {
                const slider = document.getElementById(config.id);
                const display = document.getElementById(config.display);
                
                console.log(`🔍 Checking slider: ${config.id}`);
                console.log(`  Slider element:`, slider ? '✅ Found' : '❌ Not found');
                console.log(`  Display element:`, display ? '✅ Found' : '❌ Not found');
                
                if (slider && display) {
                    // Set initial display value
                    const initialValue = slider.value + config.suffix;
                    display.textContent = initialValue;
                    console.log(`✅ Initialized slider ${config.id}: ${slider.value} -> ${initialValue}`);
                    
                    // Test the slider by programmatically triggering an input event
                    console.log(`🧪 Testing slider ${config.id}...`);
                    const testEvent = new Event('input', { bubbles: true });
                    slider.dispatchEvent(testEvent);
                    
                } else {
                    if (!slider) console.error(`❌ Slider element not found: ${config.id}`);
                    if (!display) console.error(`❌ Display element not found: ${config.display}`);
                }
            });
            
            console.log('✅ Slider initialization complete');
        }
        
        // Update individual slider display with better logging
        function updateSliderDisplay(slider) {
            console.log(`🔄 Updating display for slider: ${slider.id}, value: ${slider.value}`);
            
            const sliderConfigs = {
                'adoptionRate': { display: 'adoptionValue', suffix: '%' },
                'tfpRate': { display: 'tfpValue', suffix: '%' },
                'displacementRate': { display: 'displacementValue', suffix: '%' },
                'iterations': { display: 'iterationsValue', suffix: '' },
                'productivityMultiplier': { display: 'productivityValue', suffix: 'x' },
                'demandElasticity': { display: 'elasticityValue', suffix: '' },
                'timeHorizon': { display: 'horizonValue', suffix: ' years' }
            };
            
            const config = sliderConfigs[slider.id];
            if (config) {
                const display = document.getElementById(config.display);
                if (display) {
                    const newValue = slider.value + config.suffix;
                    display.textContent = newValue;
                    console.log(`✅ Updated ${config.display} to: ${newValue}`);
                } else {
                    console.error(`❌ Display element not found: ${config.display}`);
                }
            } else {
                console.error(`❌ No config found for slider: ${slider.id}`);
            }
        }

        // Debounced simulation runner with better feedback
        function debounceSimulation() {
            clearTimeout(debounceTimer);
            console.log('⏱️ Simulation debounced, will run in 500ms...');
            
            // Show immediate feedback that parameters changed
            const runBtn = document.getElementById('runSimulation');
            if (runBtn && !runBtn.disabled) {
                runBtn.textContent = 'Parameters Changed - Click to Update';
                runBtn.style.backgroundColor = 'var(--color-warning)';
            }
            
            debounceTimer = setTimeout(() => {
                console.log('🚀 Debounce timer expired, running simulation...');
                
                // Reset button appearance
                if (runBtn) {
                    runBtn.textContent = 'Run Simulation';
                    runBtn.style.backgroundColor = '';
                }
                
                runSimulation();
            }, 500);
        }

        // Get current parameters from UI with validation
        function getCurrentParameters() {
            console.log('📊 Extracting parameters from UI...');
            
            try {
                const elements = {
                    adoptionRate: document.getElementById('adoptionRate'),
                    tfpRate: document.getElementById('tfpRate'),
                    displacementRate: document.getElementById('displacementRate'),
                    iterations: document.getElementById('iterations'),
                    productivityMultiplier: document.getElementById('productivityMultiplier'),
                    demandElasticity: document.getElementById('demandElasticity'),
                    timeHorizon: document.getElementById('timeHorizon'),
                    randomSeed: document.getElementById('randomSeed')
                };
                
                // Check all elements exist
                for (const [key, element] of Object.entries(elements)) {
                    if (!element && key !== 'randomSeed') {
                        throw new Error(`Required parameter element not found: ${key}`);
                    }
                    if (element) {
                        console.log(`✅ ${key}: ${element.value}`);
                    }
                }
                
                const params = {
                    adoption_rate: parseFloat(elements.adoptionRate.value) / 100,
                    tfp_growth_rate: parseFloat(elements.tfpRate.value) / 100,
                    displacement_rate: parseFloat(elements.displacementRate.value) / 100,
                    iterations: parseInt(elements.iterations.value),
                    productivity_multiplier: parseFloat(elements.productivityMultiplier.value),
                    demand_elasticity: parseFloat(elements.demandElasticity.value),
                    time_horizon: parseInt(elements.timeHorizon.value),
                    labor_share: 0.60,
                    seed: elements.randomSeed ? parseInt(elements.randomSeed.value) || null : null
                };
                
                // Validate parameter ranges
                if (params.adoption_rate < 0 || params.adoption_rate > 1) {
                    throw new Error(`Invalid adoption rate: ${params.adoption_rate}`);
                }
                if (params.iterations < 10 || params.iterations > 5000) {
                    throw new Error(`Invalid iterations: ${params.iterations}`);
                }
                
                console.log('✅ Parameters extracted and validated:', params);
                return params;
            } catch (error) {
                console.error('❌ Error getting parameters:', error);
                throw new Error(`Failed to get simulation parameters: ${error.message}`);
            }
        }

        // Run simulation with better error handling
        async function runSimulation() {
            console.log('🚀 Starting simulation...');
            showLoadingIndicator();
            
            try {
                const params = getCurrentParameters();
                console.log('📊 Simulation parameters:', params);
                
                // Validate parameters
                if (!params || typeof params.iterations !== 'number') {
                    throw new Error('Invalid simulation parameters');
                }
                
                // Add small delay to show loading indicator
                await new Promise(resolve => setTimeout(resolve, 100));
                
                console.log('🔧 Running Monte Carlo simulation...');
                const startTime = performance.now();
                const results = simulator.runSimulation(params);
                const endTime = performance.now();
                
                if (!results || !results.summary) {
                    throw new Error('Simulation returned invalid results');
                }
                
                console.log(`⚡ Simulation completed in ${(endTime - startTime).toFixed(2)}ms`);
                console.log('📈 Results summary:', results.summary);
                
                console.log('📊 Updating dashboard...');
                updateDashboard(results);
                
                console.log('📈 Updating charts...');
                updateAllCharts(results);
                
                console.log('📋 Updating sectoral table...');
                updateSectoralTable(results);
                
                hideLoadingIndicator();
                console.log('✅ Simulation complete! All components updated.');
                
                // Show completion message
                const runBtn = document.getElementById('runSimulation');
                if (runBtn) {
                    const originalText = runBtn.textContent;
                    runBtn.textContent = '✅ Complete!';
                    setTimeout(() => {
                        runBtn.textContent = originalText;
                    }, 2000);
                }
                
            } catch (error) {
                console.error('❌ Simulation error:', error);
                hideLoadingIndicator();
                
                // Show user-friendly error message
                const errorMsg = `Simulation Error: ${error.message}`;
                alert(errorMsg);
                
                // Reset button state
                const runBtn = document.getElementById('runSimulation');
                if (runBtn) {
                    runBtn.textContent = 'Run Simulation';
                    runBtn.disabled = false;
                }
            }
        }

        // Run initial simulation with safety checks
        function runInitialSimulation() {
            console.log('🎬 Running initial simulation...');
            
            // Check if simulator is ready
            if (!simulator) {
                console.error('❌ Simulator not initialized!');
                return;
            }
            
            // Verify critical UI elements exist
            const criticalElements = ['runSimulation', 'adoptionRate', 'iterations'];
            const missing = criticalElements.filter(id => !document.getElementById(id));
            
            if (missing.length > 0) {
                console.error('❌ Missing UI elements for initial simulation:', missing);
                console.log('⏱️ Retrying in 1 second...');
                setTimeout(runInitialSimulation, 1000);
                return;
            }
            
            // Add a small delay to ensure DOM is fully ready
            setTimeout(() => {
                try {
                    console.log('🚀 Starting initial simulation...');
                    runSimulation();
                } catch (error) {
                    console.error('❌ Initial simulation failed:', error);
                    // Show user-friendly message
                    const runBtn = document.getElementById('runSimulation');
                    if (runBtn) {
                        runBtn.textContent = 'Click to Run Simulation';
                        runBtn.style.backgroundColor = 'var(--color-warning)';
                    }
                }
            }, 500);
        }

        // Reset to default values
        function resetToDefaults() {
            console.log('🔄 Resetting to default parameters...');
            
            try {
                // Set slider values
                const defaults = {
                    adoptionRate: 23,
                    tfpRate: 0.25,
                    displacementRate: 15,
                    iterations: 500,
                    productivityMultiplier: 1.0,
                    demandElasticity: -0.8,
                    timeHorizon: 10
                };
                
                Object.entries(defaults).forEach(([id, value]) => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.value = value;
                        updateSliderDisplay(element);
                    }
                });
                
                console.log('✅ Default values set, running simulation...');
                runSimulation();
            } catch (error) {
                console.error('❌ Error resetting to defaults:', error);
            }
        }

        // Show/hide loading indicator with better feedback
        function showLoadingIndicator() {
            const indicator = document.getElementById('loadingIndicator');
            if (indicator) {
                indicator.style.display = 'block';
                console.log('⏳ Loading indicator shown');
                
                // Update indicator text with animation
                const messages = ['Running simulation...', 'Calculating...', 'Processing results...'];
                let messageIndex = 0;
                indicator.dataset.interval = setInterval(() => {
                    const textEl = indicator.querySelector('div:last-child') || indicator;
                    if (textEl) {
                        textEl.textContent = messages[messageIndex % messages.length];
                        messageIndex++;
                    }
                }, 1000);
            } else {
                console.warn('⚠️ Loading indicator element not found');
            }
        }

        function hideLoadingIndicator() {
            const indicator = document.getElementById('loadingIndicator');
            if (indicator) {
                indicator.style.display = 'none';
                
                // Clear animation interval
                if (indicator.dataset.interval) {
                    clearInterval(parseInt(indicator.dataset.interval));
                    delete indicator.dataset.interval;
                }
                
                // Reset text
                const textEl = indicator.querySelector('div:last-child') || indicator;
                if (textEl) {
                    textEl.innerHTML = '<div class="spinner"></div>Running simulation...';
                }
                
                console.log('✅ Loading indicator hidden');
            }
        }

        // Update dashboard metrics
        function updateDashboard(results) {
            console.log('📈 Updating dashboard with results...');
            
            try {
                const summary = results.summary;
                
                // Main summary cards
                const meanGDPEl = document.getElementById('meanGDP');
                const meanEmploymentEl = document.getElementById('meanEmployment');
                const probGDPEl = document.getElementById('probGDP');
                const probEmploymentEl = document.getElementById('probEmployment');
                
                if (meanGDPEl) meanGDPEl.textContent = `+${summary.meanGDP.toFixed(2)}%`;
                if (meanEmploymentEl) meanEmploymentEl.textContent = `${summary.meanEmployment.toFixed(2)}%`;
                if (probGDPEl) probGDPEl.textContent = `${summary.probGDPOver15.toFixed(1)}%`;
                if (probEmploymentEl) probEmploymentEl.textContent = `${summary.probEmploymentUnder10.toFixed(1)}%`;
                
                // Confidence intervals
                const gdpCIEl = document.getElementById('gdpCI');
                const employmentCIEl = document.getElementById('employmentCI');
                const iterationCountEl = document.getElementById('iterationCount');
                const riskMetricEl = document.getElementById('riskMetric');
                
                if (gdpCIEl) gdpCIEl.textContent = `95% CI: [${summary.gdpCI[0].toFixed(2)}%, ${summary.gdpCI[1].toFixed(2)}%]`;
                if (employmentCIEl) employmentCIEl.textContent = `95% CI: [${summary.employmentCI[0].toFixed(2)}%, ${summary.employmentCI[1].toFixed(2)}%]`;
                if (iterationCountEl) iterationCountEl.textContent = `Based on ${getCurrentParameters().iterations} simulations`;
                if (riskMetricEl) riskMetricEl.textContent = `VaR: ${summary.valueAtRisk.toFixed(2)}%`;
                
                // Risk metrics with enhanced calculations
                const riskMetrics = calculateRiskMetrics(results);
                const annualGDPGrowthEl = document.getElementById('annualGDPGrowth');
                const annualEmploymentChangeEl = document.getElementById('annualEmploymentChange');
                const valueAtRiskEl = document.getElementById('valueAtRisk');
                const expectedShortfallEl = document.getElementById('expectedShortfall');
                
                if (annualGDPGrowthEl) annualGDPGrowthEl.textContent = `${summary.annualGDPGrowth.toFixed(2)}%`;
                if (annualEmploymentChangeEl) annualEmploymentChangeEl.textContent = `${(summary.meanEmployment / getCurrentParameters().time_horizon).toFixed(2)}%`;
                if (valueAtRiskEl) valueAtRiskEl.textContent = `${riskMetrics.valueAtRisk.toFixed(1)}%`;
                if (expectedShortfallEl) expectedShortfallEl.textContent = `${riskMetrics.expectedShortfall.toFixed(1)}%`;
                
                // Update correlation analysis
                updateCorrelationAnalysis(results);
                
                console.log('✅ Dashboard updated successfully');
            } catch (error) {
                console.error('❌ Error updating dashboard:', error);
            }
        }

        // Update sectoral analysis table
        function updateSectoralTable(results) {
            console.log('📋 Updating sectoral table...');
            
            const tbody = document.getElementById('sectorsTableBody');
            if (!tbody) {
                console.warn('⚠️ Sectoral table body not found');
                return;
            }
            
            try {
                tbody.innerHTML = '';
                let tableUpdated = false;

                simulator.sectors.forEach(sector => {
                    const sectorData = results.sectoral[sector.name];
                    if (!sectorData || !sectorData.gdpGrowth || sectorData.gdpGrowth.length === 0) {
                        console.warn(`⚠️ No valid data for sector: ${sector.name}`);
                        return;
                    }
                    
                    const meanGDP = sectorData.gdpGrowth.reduce((a, b) => a + b, 0) / sectorData.gdpGrowth.length;
                    const meanEmployment = sectorData.employmentChange.reduce((a, b) => a + b, 0) / sectorData.employmentChange.length;
                    const meanProductivity = sectorData.productivityGain.reduce((a, b) => a + b, 0) / sectorData.productivityGain.length;
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><strong>${sector.name}</strong></td>
                        <td>${(sector.ai_exposure * 100).toFixed(0)}%</td>
                        <td>${meanProductivity.toFixed(2)}%</td>
                        <td class="${meanEmployment >= 0 ? 'text-success' : 'text-error'}">${meanEmployment.toFixed(2)}%</td>
                        <td class="${meanGDP >= 0 ? 'text-success' : 'text-error'}">${meanGDP >= 0 ? '+' : ''}${meanGDP.toFixed(2)}%</td>
                    `;
                    tbody.appendChild(row);
                    tableUpdated = true;
                });
                
                if (tableUpdated) {
                    console.log('✅ Sectoral table updated successfully');
                } else {
                    console.warn('⚠️ No sectors were added to table');
                }
            } catch (error) {
                console.error('❌ Error updating sectoral table:', error);
            }
        }

        // Table sorting functionality
        let currentSort = { column: -1, direction: 'asc' };

        function sortTable(columnIndex) {
            const table = document.getElementById('sectorsTable');
            const tbody = table.getElementsByTagName('tbody')[0];
            const rows = Array.from(tbody.getElementsByTagName('tr'));

            // Determine sort direction
            if (currentSort.column === columnIndex) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.direction = 'asc';
                currentSort.column = columnIndex;
            }

            // Sort rows
            rows.sort((a, b) => {
                const aValue = a.children[columnIndex].textContent;
                const bValue = b.children[columnIndex].textContent;
                
                let comparison;
                if (columnIndex === 0) { // Text column (sector name)
                    comparison = aValue.localeCompare(bValue);
                } else { // Numeric columns
                    comparison = parseFloat(aValue) - parseFloat(bValue);
                }
                
                return currentSort.direction === 'asc' ? comparison : -comparison;
            });

            // Update sort indicators
            const headers = table.getElementsByTagName('th');
            Array.from(headers).forEach((header, index) => {
                const indicator = header.querySelector('.sort-indicator');
                if (index === columnIndex) {
                    indicator.textContent = currentSort.direction === 'asc' ? '↑' : '↓';
                    indicator.classList.add('active');
                } else {
                    indicator.textContent = '↕';
                    indicator.classList.remove('active');
                }
            });

            // Reappend sorted rows
            rows.forEach(row => tbody.appendChild(row));
        }

        // Filter sectors table
        function filterSectors() {
            const filterInput = document.getElementById('sectorFilter');
            if (!filterInput) return;
            
            const filterText = filterInput.value.toLowerCase();
            const rows = document.querySelectorAll('#sectorsTableBody tr');
            
            console.log(`🔍 Filtering sectors with: "${filterText}"`);
            
            let visibleCount = 0;
            rows.forEach(row => {
                const sectorName = row.children[0].textContent.toLowerCase();
                const isVisible = sectorName.includes(filterText);
                row.style.display = isVisible ? '' : 'none';
                if (isVisible) visibleCount++;
            });
            
            console.log(`📊 ${visibleCount}/${rows.length} sectors visible after filter`);
        }

        // Initialize charts
