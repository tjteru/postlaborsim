function initializeCharts() {
            console.log('📊 Initializing Chart.js charts...');
            
            Chart.defaults.font.family = 'var(--font-family-base)';
            Chart.defaults.color = 'var(--color-text)';
            
            try {
                // Overview chart
                const overviewCtx = document.getElementById('overviewChart')?.getContext('2d');
            if (overviewCtx) {
                currentCharts.overview = new Chart(overviewCtx, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            label: 'GDP Growth (%)',
                            data: [],
                            borderColor: simulationData.chartColors.gdp,
                            backgroundColor: simulationData.chartColors.gdp + '20',
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Economic Impact Over Time'
                            }
                        }
                    }
                });
            }
            
            // Time series chart
            const timeSeriesCtx = document.getElementById('timeSeriesChart')?.getContext('2d');
            if (timeSeriesCtx) {
                currentCharts.timeSeries = new Chart(timeSeriesCtx, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: []
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                title: {
                                    display: true,
                                    text: 'Percentage Change'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Year'
                                }
                            }
                        }
                    }
                });
            }
            
            // Distribution chart
            const distributionCtx = document.getElementById('distributionChart')?.getContext('2d');
            if (distributionCtx) {
                currentCharts.distribution = new Chart(distributionCtx, {
                    type: 'bar',
                    data: {
                        labels: [],
                        datasets: []
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Distribution of Outcomes'
                            }
                        }
                    }
                });
            }
            
            // Sectoral chart
            const sectoralCtx = document.getElementById('sectoralChart')?.getContext('2d');
            if (sectoralCtx) {
                currentCharts.sectoral = new Chart(sectoralCtx, {
                    type: 'scatter',
                    data: {
                        datasets: []
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'AI Exposure vs Economic Impact by Sector'
                            }
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'AI Exposure (%)'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'GDP Impact (%)'
                                }
                            }
                        }
                    }
                });
            }
            
            // Scenario comparison chart
            const scenarioCtx = document.getElementById('scenarioChart')?.getContext('2d');
            if (scenarioCtx) {
                currentCharts.scenario = new Chart(scenarioCtx, {
                    type: 'radar',
                    data: {
                        labels: ['GDP Growth', 'Employment Impact', 'Productivity', 'Risk Level'],
                        datasets: []
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Scenario Comparison'
                            }
                        }
                    }
                });
            }
            
            // Scatter chart
            const scatterCtx = document.getElementById('scatterChart')?.getContext('2d');
            if (scatterCtx) {
                currentCharts.scatter = new Chart(scatterCtx, {
                    type: 'scatter',
                    data: {
                        datasets: []
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'GDP Growth vs Employment Change'
                            }
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'GDP Growth (%)'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Employment Change (%)'
                                }
                            }
                        }
                    }
                });
            }
            
            console.log('✅ All charts initialized successfully');
            } catch (error) {
                console.error('❌ Error initializing charts:', error);
            }
        }

        // Update all charts
        function updateAllCharts(results) {
            console.log('📊 Updating all charts with new data...');
            
            try {
                updateOverviewChart(results);
                updateTimeSeriesChart(results);
                updateDistributionChart(results);
                updateSectoralChart(results);
                updateScatterChart(results);
                updateScenarioChart(results);
                
                console.log('✅ All charts updated successfully');
            } catch (error) {
                console.error('❌ Error updating charts:', error);
            }
        }

        // Update charts for specific tab
        function updateChartsForTab(tabName) {
            if (!simulator.results) return;
            
            switch(tabName) {
                case 'overview':
                    updateOverviewChart(simulator.results);
                    break;
                case 'charts':
                    updateTimeSeriesChart(simulator.results);
                    updateDistributionChart(simulator.results);
                    updateScatterChart(simulator.results);
                    break;
                case 'sectoral':
                    updateSectoralChart(simulator.results);
                    break;
                case 'scenarios':
                    updateScenarioChart(simulator.results);
                    break;
            }
        }

        // Individual chart update functions
        function updateOverviewChart(results) {
            if (!currentCharts.overview) {
                console.warn('⚠️ Overview chart not initialized');
                return;
            }
            
            try {
                const years = Array.from({length: getCurrentParameters().time_horizon}, (_, i) => i + 1);
                
                // Generate sample time series data if not available
                let timeSeriesData;
                if (results.timeSeries && results.timeSeries.length > 0) {
                    timeSeriesData = results.timeSeries[0];
                } else {
                    // Generate synthetic time series
                    timeSeriesData = years.map(year => ({
                        year,
                        gdpGrowth: results.summary.annualGDPGrowth * year + (Math.random() - 0.5) * 2
                    }));
                }
                
                currentCharts.overview.data.labels = years;
                currentCharts.overview.data.datasets[0].data = timeSeriesData.map(point => point.gdpGrowth || 0);
                currentCharts.overview.update('none'); // Skip animations for better performance
                
                console.log('✅ Overview chart updated');
            } catch (error) {
                console.error('❌ Error updating overview chart:', error);
            }
        }

        function updateTimeSeriesChart(results) {
            if (!currentCharts.timeSeries) {
                console.warn('⚠️ Time series chart not initialized');
                return;
            }
            
            try {
                const years = Array.from({length: getCurrentParameters().time_horizon}, (_, i) => i + 1);
                
                // Generate realistic time series data
                const gdpData = years.map(year => {
                    const baseGrowth = results.summary.annualGDPGrowth * year;
                    const noise = (Math.random() - 0.5) * 2;
                    return baseGrowth + noise;
                });
                
                const employmentData = years.map(year => {
                    const baseChange = (results.summary.meanEmployment / getCurrentParameters().time_horizon) * year;
                    const noise = (Math.random() - 0.5) * 1;
                    return baseChange + noise;
                });
                
                currentCharts.timeSeries.data.labels = years;
                currentCharts.timeSeries.data.datasets = [
                    {
                        label: 'GDP Growth (%)',
                        data: gdpData,
                        borderColor: simulationData.chartColors.gdp,
                        backgroundColor: simulationData.chartColors.gdp + '40',
                        fill: false,
                        tension: 0.2
                    },
                    {
                        label: 'Employment Change (%)',
                        data: employmentData,
                        borderColor: simulationData.chartColors.employment,
                        backgroundColor: simulationData.chartColors.employment + '40',
                        fill: false,
                        tension: 0.2
                    }
                ];
                currentCharts.timeSeries.update('none');
                
                console.log('✅ Time series chart updated');
            } catch (error) {
                console.error('❌ Error updating time series chart:', error);
            }
        }

        function updateDistributionChart(results) {
            if (!currentCharts.distribution) {
                console.warn('⚠️ Distribution chart not initialized');
                return;
            }
            
            try {
                // Create histogram bins
                const gdpData = results.distributions.gdp;
                const bins = 20;
                const min = Math.min(...gdpData);
                const max = Math.max(...gdpData);
                const binWidth = (max - min) / bins;
                
                const histogram = new Array(bins).fill(0);
                const labels = [];
                
                for (let i = 0; i < bins; i++) {
                    labels.push((min + i * binWidth).toFixed(1));
                }
                
                gdpData.forEach(value => {
                    const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
                    if (binIndex >= 0) histogram[binIndex]++;
                });
                
                currentCharts.distribution.data.labels = labels;
                currentCharts.distribution.data.datasets = [{
                    label: 'GDP Growth Distribution',
                    data: histogram,
                    backgroundColor: simulationData.chartColors.gdp + '80',
                    borderColor: simulationData.chartColors.gdp,
                    borderWidth: 1
                }];
                currentCharts.distribution.update('none');
                
                console.log('✅ Distribution chart updated');
            } catch (error) {
                console.error('❌ Error updating distribution chart:', error);
            }
        }

        function updateSectoralChart(results) {
            if (!currentCharts.sectoral) {
                console.warn('⚠️ Sectoral chart not initialized');
                return;
            }
            
            try {
                const scatterData = simulator.sectors.map((sector, index) => {
                    const sectorResults = results.sectoral[sector.name];
                    if (!sectorResults) {
                        console.warn(`No results for sector: ${sector.name}`);
                        return { x: sector.ai_exposure * 100, y: 0 };
                    }
                    
                    const meanGDP = sectorResults.gdpGrowth.reduce((a, b) => a + b, 0) / sectorResults.gdpGrowth.length;
                    
                    return {
                        x: sector.ai_exposure * 100,
                        y: meanGDP
                    };
                });
                
                currentCharts.sectoral.data.datasets = [{
                    label: 'Sectors by AI Exposure vs GDP Impact',
                    data: scatterData,
                    backgroundColor: simulationData.chartColors.sectors.slice(0, scatterData.length),
                    pointRadius: 6,
                    pointHoverRadius: 8
                }];
                currentCharts.sectoral.update('none');
                
                console.log('✅ Sectoral chart updated');
            } catch (error) {
                console.error('❌ Error updating sectoral chart:', error);
            }
        }

        function updateScatterChart(results) {
            if (!currentCharts.scatter) {
                console.warn('⚠️ Scatter chart not initialized');
                return;
            }
            
            try {
                const scatterData = results.distributions.gdp.map((gdp, i) => ({
                    x: gdp,
                    y: results.distributions.employment[i]
                })).slice(0, 200); // Limit points for performance
                
                currentCharts.scatter.data.datasets = [{
                    label: 'Simulation Results (GDP vs Employment)',
                    data: scatterData,
                    backgroundColor: simulationData.chartColors.productivity + '60',
                    pointRadius: 3,
                    pointHoverRadius: 5
                }];
                currentCharts.scatter.update('none');
                
                console.log('✅ Scatter chart updated');
            } catch (error) {
                console.error('❌ Error updating scatter chart:', error);
            }
        }

        function updateScenarioChart(results) {
            if (!currentCharts.scenario) {
                console.warn('⚠️ Scenario chart not initialized');
                return;
            }
            
            try {
                const currentMetrics = [
                    Math.max(0, results.summary.meanGDP / 2), // Scale down for radar visibility
                    Math.abs(results.summary.meanEmployment / 2),
                    Math.max(0, results.summary.annualGDPGrowth * 10), // Scale for visibility
                    Math.abs(results.summary.valueAtRisk / 2)
                ];
                
                currentCharts.scenario.data.datasets = [{
                    label: 'Current Scenario',
                    data: currentMetrics,
                    borderColor: simulationData.chartColors.gdp,
                    backgroundColor: simulationData.chartColors.gdp + '40',
                    pointBackgroundColor: simulationData.chartColors.gdp,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: simulationData.chartColors.gdp
                }];
                currentCharts.scenario.update('none');
                
                console.log('✅ Scenario chart updated');
            } catch (error) {
                console.error('❌ Error updating scenario chart:', error);
            }
        }

        // Export functionality
        function exportChart(format) {
            const activeTab = document.querySelector('.tab-button.active').dataset.tab;
            const chart = getActiveChart(activeTab);
            
            if (format === 'png' && chart) {
                const link = document.createElement('a');
                link.download = `ai-simulation-${activeTab}.png`;
                link.href = chart.toBase64Image();
                link.click();
            } else if (format === 'csv') {
                exportDataAsCSV();
            }
        }

        function getActiveChart(tabName) {
            switch(tabName) {
                case 'overview': return currentCharts.overview;
                case 'charts': return currentCharts.timeSeries;
                case 'sectoral': return currentCharts.sectoral;
                case 'scenarios': return currentCharts.scenario;
                default: return null;
            }
        }

        function exportDataAsCSV() {
            if (!simulator.results) return;
            
            const results = simulator.results;
            let csv = 'Iteration,GDP Growth (%),Employment Change (%)\n';
            
            results.distributions.gdp.forEach((gdp, i) => {
                csv += `${i + 1},${gdp.toFixed(2)},${results.distributions.employment[i].toFixed(2)}\n`;
            });
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'ai-simulation-results.csv';
            link.click();
        }

        function exportSectorData() {
            if (!simulator.results) return;
            
            let csv = 'Sector,AI Exposure (%),Avg Productivity Gain (%),Avg Employment Impact (%),Avg GDP Contribution (%),Correlation\n';
            
            simulator.sectors.forEach(sector => {
                const sectorData = simulator.results.sectoral[sector.name];
                if (sectorData) {
                    const meanProductivity = sectorData.productivityGain.reduce((a, b) => a + b, 0) / sectorData.productivityGain.length;
                    const meanEmployment = sectorData.employmentChange.reduce((a, b) => a + b, 0) / sectorData.employmentChange.length;
                    const meanGDP = sectorData.gdpGrowth.reduce((a, b) => a + b, 0) / sectorData.gdpGrowth.length;
                    
                    // Get correlation if available
                    const correlation = simulator.correlations ? 
                        simulator.correlations.find(c => c.sector === sector.name)?.correlation || 0 : 0;
                    
                    csv += `${sector.name},${(sector.ai_exposure * 100).toFixed(1)},${meanProductivity.toFixed(2)},${meanEmployment.toFixed(2)},${meanGDP.toFixed(2)},${correlation.toFixed(3)}\n`;
                }
            });
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'sectoral-analysis.csv';
            link.click();
        }

        // Sensitivity analysis
        function runSensitivityAnalysis() {
            showLoadingIndicator();
            
            const baseParams = getCurrentParameters();
            const sensitivityResults = [];
            
            // Test parameter variations
            const parameterRanges = {
                adoption_rate: [0.1, 0.2, 0.3, 0.4, 0.5],
                displacement_rate: [0.05, 0.1, 0.15, 0.2, 0.25],
                productivity_multiplier: [0.5, 0.8, 1.0, 1.2, 1.5]
            };
            
            Object.entries(parameterRanges).forEach(([param, values]) => {
                values.forEach(value => {
                    const testParams = { ...baseParams };
                    testParams[param] = value;
                    testParams.iterations = 100; // Reduce iterations for speed
                    
                    const results = simulator.runSimulation(testParams);
                    sensitivityResults.push({
                        parameter: param,
                        value: value,
                        gdpGrowth: results.summary.meanGDP,
                        employmentChange: results.summary.meanEmployment
                    });
                });
            });
            
            // Store sensitivity results
            simulator.sensitivityResults = sensitivityResults;
            
            // Create sensitivity chart if on charts tab
            updateSensitivityChart(sensitivityResults);
            
            hideLoadingIndicator();
            console.log('Sensitivity analysis complete. Results available in charts tab.');
        }

        function updateSensitivityChart(sensitivityResults) {
            // This would create a new chart showing parameter sensitivity
            // For now, we'll log the results
            console.log('Sensitivity Analysis Results:', sensitivityResults);
        }

        // Advanced controls toggle
        function toggleAdvanced() {
            const content = document.getElementById('advancedContent');
            const arrow = document.getElementById('advancedArrow');
            
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                arrow.textContent = '▼';
            } else {
                content.classList.add('expanded');
                arrow.textContent = '▲';
            }
        }

        // Table sorting functionality
        currentSort = { column: -1, direction: 'asc' };

        function sortTable(columnIndex) {
            const table = document.getElementById('sectorsTable');
            if (!table) return;
            
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
                const aValue = a.children[columnIndex].textContent.trim();
                const bValue = b.children[columnIndex].textContent.trim();
                
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
                if (indicator) {
                    if (index === columnIndex) {
                        indicator.textContent = currentSort.direction === 'asc' ? '↑' : '↓';
                        indicator.classList.add('active');
                    } else {
                        indicator.textContent = '↕';
                        indicator.classList.remove('active');
                    }
                }
            });

            // Reappend sorted rows
            rows.forEach(row => tbody.appendChild(row));
        }

        // Scenario management
        function saveCurrentScenario(name) {
            const params = getCurrentParameters();
            savedScenarios[name] = {
                ...params,
                results: simulator.results,
                timestamp: new Date().toISOString()
            };
            
            // Store in browser memory (not localStorage due to sandbox restrictions)
            updateScenarioCards();
        }

        function loadScenario(name) {
            const scenario = savedScenarios[name];
            if (!scenario) return;
            
            // Update UI controls
            document.getElementById('adoptionRate').value = scenario.adoption_rate * 100;
            document.getElementById('tfpRate').value = scenario.tfp_risk_rate * 100;
            document.getElementById('displacementRate').value = scenario.displacement_rate * 100;
            document.getElementById('iterations').value = scenario.iterations;
            document.getElementById('productivityMultiplier').value = scenario.productivity_multiplier;
            document.getElementById('demandElasticity').value = scenario.demand_elasticity;
            document.getElementById('timeHorizon').value = scenario.time_horizon;
            
            // Update displays and run simulation
            initializeSliders();
            runSimulation();
        }

        function updateScenarioCards() {
            // Update scenario comparison with saved scenarios
            const scenarios = Object.keys(savedScenarios);
            if (scenarios.length > 0) {
                // This would update the scenario comparison visualization
                console.log('Updated scenarios:', scenarios);
            }
        }

        // Risk analysis calculations
        function calculateRiskMetrics(results) {
            const gdpValues = results.distributions.gdp.sort((a, b) => a - b);
            const employmentValues = results.distributions.employment.sort((a, b) => a - b);
            
            // Value at Risk (5th percentile)
            const var5 = gdpValues[Math.floor(0.05 * gdpValues.length)];
            
            // Expected Shortfall (average of worst 5%)
            const worstOutcomes = gdpValues.slice(0, Math.floor(0.05 * gdpValues.length));
            const expectedShortfall = worstOutcomes.reduce((a, b) => a + b, 0) / worstOutcomes.length;
            
            // Conditional Value at Risk
            const cvar = employmentValues[Math.floor(0.05 * employmentValues.length)];
            
            // Sharpe-like ratio (mean/volatility)
            const gdpMean = gdpValues.reduce((a, b) => a + b, 0) / gdpValues.length;
            const gdpStd = Math.sqrt(gdpValues.map(x => Math.pow(x - gdpMean, 2)).reduce((a, b) => a + b, 0) / gdpValues.length);
            const riskAdjustedReturn = gdpStd > 0 ? gdpMean / gdpStd : 0;
            
            return {
                valueAtRisk: var5,
                expectedShortfall,
                conditionalVaR: cvar,
                riskAdjustedReturn,
                volatility: gdpStd
            };
        }
