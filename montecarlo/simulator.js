// Monte Carlo Simulator Class
        class MonteCarloSimulator {
            constructor() {
                this.sectors = [
                    { name: "Professional Services", weight: 0.085, ai_exposure: 0.68, base_productivity: 0.40 },
                    { name: "Financial Services", weight: 0.062, ai_exposure: 0.65, base_productivity: 0.25 },
                    { name: "ICT Services", weight: 0.048, ai_exposure: 0.75, base_productivity: 0.35 },
                    { name: "Software Development", weight: 0.021, ai_exposure: 0.85, base_productivity: 0.50 },
                    { name: "Healthcare", weight: 0.142, ai_exposure: 0.45, base_productivity: 0.20 },
                    { name: "Manufacturing", weight: 0.121, ai_exposure: 0.35, base_productivity: 0.15 },
                    { name: "Construction", weight: 0.068, ai_exposure: 0.25, base_productivity: 0.10 },
                    { name: "Retail", weight: 0.105, ai_exposure: 0.40, base_productivity: 0.20 },
                    { name: "Transportation", weight: 0.052, ai_exposure: 0.30, base_productivity: 0.15 },
                    { name: "Education", weight: 0.091, ai_exposure: 0.50, base_productivity: 0.25 },
                    { name: "Other", weight: 0.205, ai_exposure: 0.30, base_productivity: 0.12 }
                ];
                
                this.results = null;
                this.parameters = {
                    adoption_rate: 0.23,
                    tfp_growth_rate: 0.0025,
                    displacement_rate: 0.15,
                    iterations: 500,
                    productivity_multiplier: 1.0,
                    demand_elasticity: -0.8,
                    time_horizon: 10,
                    labor_share: 0.60,
                    // New parameters for enhanced demand modeling
                    unemployment_consumption_loss: 0.95,  // Unemployed lose 95% of consumption
                    marginal_propensity_to_consume: 0.75, // Workers spend 75% of income
                    wealth_concentration_factor: 0.3      // Productivity gains go 30% to labor, 70% to capital
                };
            }

            // Generate random number with seed support
            random(seed) {
                if (seed) {
                    const x = Math.sin(seed) * 10000;
                    return x - Math.floor(x);
                }
                return Math.random();
            }

            // Normal distribution using Box-Muller transform
            normalRandom(mean = 0, std = 1, seed = null) {
                const u1 = this.random(seed);
                const u2 = this.random(seed ? seed + 1 : null);
                const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                return mean + std * z0;
            }

            // Beta distribution approximation
            betaRandom(alpha, beta, seed = null) {
                const x = this.normalRandom(0, 1, seed);
                const y = this.normalRandom(0, 1, seed ? seed + 1 : null);
                return Math.max(0, Math.min(1, (x * alpha) / (x * alpha + y * beta)));
            }

            // Run single simulation iteration with enhanced error handling
            runIteration(params, iteration) {
                try {
                    const seed = params.seed ? params.seed + iteration : null;
                    
                    // Stochastic shocks with bounds checking
                    const adoptionShock = Math.max(0.5, Math.min(1.5, this.normalRandom(1, 0.1, seed)));
                    const productivityShock = Math.max(0.7, Math.min(1.3, this.normalRandom(1, 0.15, seed ? seed + 10 : null)));
                    const displacementShock = Math.max(0.8, Math.min(1.2, this.normalRandom(1, 0.1, seed ? seed + 20 : null)));
                    
                    let totalGDPGrowth = 0;
                    let totalEmploymentChange = 0;
                    let sectoralResults = [];
                    
                    this.sectors.forEach((sector, i) => {
                        // Sector-specific calculations with realistic bounds
                        const effectiveAdoption = Math.min(0.8, Math.max(0, params.adoption_rate * adoptionShock * sector.ai_exposure));
                        const productivityGain = Math.max(0, sector.base_productivity * params.productivity_multiplier * productivityShock);
                        const employmentLoss = Math.min(0.4, Math.max(0, params.displacement_rate * displacementShock * sector.ai_exposure));

                        // Employment impact with adjustment for new job creation
                        const directDisplacement = effectiveAdoption * employmentLoss;
                        const jobCreationEffect = Math.max(0, effectiveAdoption * productivityGain * 0.3); // New jobs from growth
                        const netEmploymentLoss = directDisplacement - jobCreationEffect;
                        const sectorEmploymentChange = -netEmploymentLoss;

                        // Enhanced demand-side modeling
                        // Calculate consumption impact from unemployment
                        const mpc = params.marginal_propensity_to_consume || 0.75;
                        const consumptionLossPerUnemployed = params.unemployment_consumption_loss || 0.95;
                        const consumptionImpact = -netEmploymentLoss * consumptionLossPerUnemployed * mpc * params.labor_share;

                        // Calculate how productivity gains are distributed
                        const wealthFactor = params.wealth_concentration_factor || 0.3;
                        const laborIncomeGain = effectiveAdoption * productivityGain * wealthFactor * mpc;
                        const capitalIncomeGain = effectiveAdoption * productivityGain * (1 - wealthFactor) * 0.3; // Capital owners spend less (30%)

                        // Net demand effect combines consumption loss and income gains
                        const netDemandEffect = consumptionImpact + laborIncomeGain + capitalIncomeGain;

                        // Enhanced GDP contribution calculation
                        const baseGDPContribution = effectiveAdoption * productivityGain;
                        const demandMultiplier = 1 + netDemandEffect;
                        const sectorGDPGrowth = baseGDPContribution * Math.max(0.1, demandMultiplier);
                        
                        // Validate calculations
                        if (isNaN(sectorGDPGrowth) || isNaN(sectorEmploymentChange)) {
                            console.warn(`Warning: NaN values in sector ${sector.name} iteration ${iteration}`);
                            return;
                        }
                        
                        // Weight by sector size
                        totalGDPGrowth += sectorGDPGrowth * sector.weight;
                        totalEmploymentChange += sectorEmploymentChange * sector.weight;
                        
                        sectoralResults.push({
                            sector: sector.name,
                            gdpGrowth: sectorGDPGrowth,
                            employmentChange: sectorEmploymentChange,
                            productivityGain: productivityGain * 100,
                            effectiveAdoption: effectiveAdoption * 100
                        });
                    });
                    
                    // Apply time horizon with compounding for GDP
                    const annualGDPGrowth = totalGDPGrowth;
                    const cumulativeGDPGrowth = ((1 + Math.max(-0.5, Math.min(2, totalGDPGrowth))) ** params.time_horizon - 1) * 100;
                    const cumulativeEmploymentChange = totalEmploymentChange * params.time_horizon * 100;
                    
                    return {
                        annualGDPGrowth: annualGDPGrowth * 100,
                        cumulativeGDPGrowth: cumulativeGDPGrowth,
                        cumulativeEmploymentChange: cumulativeEmploymentChange,
                        sectoralResults
                    };
                } catch (error) {
                    console.error(`Error in iteration ${iteration}:`, error);
                    // Return safe default values
                    return {
                        annualGDPGrowth: 0,
                        cumulativeGDPGrowth: 0,
                        cumulativeEmploymentChange: 0,
                        sectoralResults: []
                    };
                }
            }

            // Run full Monte Carlo simulation with progress tracking
            runSimulation(params) {
                console.log('🚀 Starting Monte Carlo simulation...');
                console.log('📊 Parameters:', params);
                
                const startTime = performance.now();
                
                const results = {
                    gdpGrowthValues: [],
                    employmentChangeValues: [],
                    annualGDPValues: [],
                    sectoralData: {},
                    timeSeries: []
                };
                
                // Initialize sectoral data storage
                this.sectors.forEach(sector => {
                    results.sectoralData[sector.name] = {
                        gdpGrowth: [],
                        employmentChange: [],
                        productivityGain: []
                    };
                });
                
                console.log(`🔄 Running ${params.iterations} iterations...`);
                
                // Run iterations with progress logging
                const progressInterval = Math.max(1, Math.floor(params.iterations / 10));
                
                for (let i = 0; i < params.iterations; i++) {
                    try {
                        const iteration = this.runIteration(params, i);
                        
                        if (!iteration) {
                            console.warn(`Iteration ${i} returned null/undefined`);
                            continue;
                        }
                        
                        // Store results with validation
                        if (!isNaN(iteration.cumulativeGDPGrowth)) {
                            results.gdpGrowthValues.push(iteration.cumulativeGDPGrowth);
                        }
                        if (!isNaN(iteration.cumulativeEmploymentChange)) {
                            results.employmentChangeValues.push(iteration.cumulativeEmploymentChange);
                        }
                        if (!isNaN(iteration.annualGDPGrowth)) {
                            results.annualGDPValues.push(iteration.annualGDPGrowth);
                        }
                        
                        // Store sectoral results
                        if (iteration.sectoralResults && Array.isArray(iteration.sectoralResults)) {
                            iteration.sectoralResults.forEach(sectorResult => {
                                const sectorData = results.sectoralData[sectorResult.sector];
                                if (sectorData) {
                                    if (!isNaN(sectorResult.gdpGrowth)) {
                                        sectorData.gdpGrowth.push(sectorResult.gdpGrowth * 100);
                                    }
                                    if (!isNaN(sectorResult.employmentChange)) {
                                        sectorData.employmentChange.push(sectorResult.employmentChange * 100);
                                    }
                                    if (!isNaN(sectorResult.productivityGain)) {
                                        sectorData.productivityGain.push(sectorResult.productivityGain);
                                    }
                                }
                            });
                        }
                        
                        // Generate time series (every 10th iteration for performance)
                        if (i % 10 === 0) {
                            const timeSeriesPoint = [];
                            for (let year = 1; year <= params.time_horizon; year++) {
                                timeSeriesPoint.push({
                                    year,
                                    gdpGrowth: iteration.annualGDPGrowth * year + this.normalRandom(0, 2),
                                    employmentChange: iteration.cumulativeEmploymentChange * (year / params.time_horizon) + this.normalRandom(0, 1)
                                });
                            }
                            results.timeSeries.push(timeSeriesPoint);
                        }
                        
                        // Progress logging
                        if (i % progressInterval === 0) {
                            const progress = ((i + 1) / params.iterations * 100).toFixed(0);
                            console.log(`📊 Progress: ${progress}% (${i + 1}/${params.iterations})`);
                        }
                        
                    } catch (error) {
                        console.error(`Error in iteration ${i}:`, error);
                        continue;
                    }
                }
                
                console.log(`✅ Completed ${results.gdpGrowthValues.length} valid iterations out of ${params.iterations}`);
                
                if (results.gdpGrowthValues.length === 0) {
                    throw new Error('No valid simulation results generated');
                }
                
                // Calculate summary statistics with proper validation
                const gdpMean = results.gdpGrowthValues.reduce((a, b) => a + b, 0) / results.gdpGrowthValues.length;
                const employmentMean = results.employmentChangeValues.reduce((a, b) => a + b, 0) / results.employmentChangeValues.length;
                const annualGDPMean = results.annualGDPValues.reduce((a, b) => a + b, 0) / results.annualGDPValues.length;
                
                console.log(`📊 Statistics: GDP Mean=${gdpMean.toFixed(2)}%, Employment Mean=${employmentMean.toFixed(2)}%`);
                
                // Sort for percentile calculations
                const sortedGDP = [...results.gdpGrowthValues].sort((a, b) => a - b);
                const sortedEmployment = [...results.employmentChangeValues].sort((a, b) => a - b);
                
                const gdpP5 = sortedGDP[Math.max(0, Math.floor(0.05 * sortedGDP.length))];
                const gdpP95 = sortedGDP[Math.min(sortedGDP.length - 1, Math.floor(0.95 * sortedGDP.length))];
                const empP5 = sortedEmployment[Math.max(0, Math.floor(0.05 * sortedEmployment.length))];
                const empP95 = sortedEmployment[Math.min(sortedEmployment.length - 1, Math.floor(0.95 * sortedEmployment.length))];
                
                const probGDPOver15 = sortedGDP.filter(v => v > 15).length / sortedGDP.length * 100;
                const probEmploymentUnder10 = sortedEmployment.filter(v => v < -10).length / sortedEmployment.length * 100;
                
                console.log(`📈 Probabilities: GDP>15%=${probGDPOver15.toFixed(1)}%, Employment<-10%=${probEmploymentUnder10.toFixed(1)}%`);
                
                const executionTime = performance.now() - startTime;
                
                // Calculate expected shortfall properly
                const worstGDPOutcomes = sortedGDP.slice(0, Math.max(1, Math.floor(0.05 * sortedGDP.length)));
                const expectedShortfall = worstGDPOutcomes.length > 0 ? worstGDPOutcomes.reduce((a, b) => a + b, 0) / worstGDPOutcomes.length : gdpP5;
                
                this.results = {
                    summary: {
                        meanGDP: gdpMean,
                        meanEmployment: employmentMean,
                        annualGDPGrowth: annualGDPMean,
                        gdpCI: [gdpP5, gdpP95],
                        employmentCI: [empP5, empP95],
                        probGDPOver15,
                        probEmploymentUnder10,
                        valueAtRisk: gdpP5,
                        expectedShortfall,
                        executionTime
                    },
                    distributions: {
                        gdp: sortedGDP,
                        employment: sortedEmployment
                    },
                    sectoral: results.sectoralData,
                    timeSeries: results.timeSeries,
                    rawData: results
                };
                
                console.log(`🎯 Simulation complete: ${executionTime.toFixed(2)}ms`);
                console.log('📈 Final Results Summary:');
                console.log(`  GDP Growth: ${gdpMean.toFixed(2)}% (${gdpP5.toFixed(2)}% to ${gdpP95.toFixed(2)}%)`);
                console.log(`  Employment: ${employmentMean.toFixed(2)}% (${empP5.toFixed(2)}% to ${empP95.toFixed(2)}%)`);
                
                return this.results;
            }
        }
