// Performance optimization for large datasets
function sampleData(data, maxPoints = 1000) {
    if (data.length <= maxPoints) return data;
    
    const step = Math.floor(data.length / maxPoints);
    return data.filter((_, index) => index % step === 0);
}

// Correlation analysis
function calculateCorrelation(x, y) {
    const n = Math.min(x.length, y.length);
    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
}

// Update correlation analysis in sectoral tab
function updateCorrelationAnalysis(results) {
    const correlations = [];
    
    simulator.sectors.forEach(sector => {
        const sectorData = results.sectoral[sector.name];
        if (sectorData) {
            const correlation = calculateCorrelation(
                sectorData.gdpGrowth,
                sectorData.employmentChange
            );
            
            correlations.push({
                sector: sector.name,
                correlation: correlation,
                aiExposure: sector.ai_exposure
            });
        }
    });
    
    // Store correlations for potential display
    simulator.correlations = correlations;
}

// Enhanced chart interactions
function addChartInteractions() {
    // Add click handlers for chart drill-down
    Object.values(currentCharts).forEach(chart => {
        if (chart && chart.canvas) {
            chart.canvas.onclick = function(evt) {
                const points = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
                
                if (points.length) {
                    const firstPoint = points[0];
                    const label = chart.data.labels[firstPoint.index];
                    const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
                    
                    // Show detailed information in a tooltip or modal
                    showDataPoint(label, value, firstPoint.datasetIndex);
                }
            };
        }
    });
}

function showDataPoint(label, value, datasetIndex) {
    // Create a simple tooltip or alert with data point information
    const info = `Data Point: ${label}\nValue: ${typeof value === 'object' ? JSON.stringify(value) : value}`;
    console.log(info); // In a real app, this would show a proper modal/tooltip
}

// Batch parameter updates for scenario comparison
function updateParametersBatch(parameterSet) {
    Object.entries(parameterSet).forEach(([key, value]) => {
        const element = document.getElementById(key);
        if (element) {
            element.value = value;
            // Trigger change event to update display
            element.dispatchEvent(new Event('input'));
        }
    });
}

// Methodology toggle
function toggleMethodology() {
    console.log('📖 Toggling methodology section...');
    
    const content = document.getElementById('methodologyContent');
    const arrow = document.getElementById('methodologyArrow');
    
    if (!content || !arrow) {
        console.warn('⚠️ Methodology elements not found');
        return;
    }
    
    if (content.classList.contains('show')) {
        content.classList.remove('show');
        arrow.classList.remove('rotated');
        arrow.textContent = '▼';
        console.log('📖 Methodology section collapsed');
    } else {
        content.classList.add('show');
        arrow.classList.add('rotated');
        arrow.textContent = '▲';
        console.log('📖 Methodology section expanded');
    }
}

// Initialize chart interactions after charts are created
function initializeInteractions() {
    addChartInteractions();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'r':
                    e.preventDefault();
                    runSimulation();
                    break;
                case 'e':
                    e.preventDefault();
                    exportChart('png');
                    break;
                case 'd':
                    e.preventDefault();
                    resetToDefaults();
                    break;
            }
        }
    });
}

// Enhanced scenario presets
const scenarioPresets = {
    conservative: {
        name: 'Conservative Adoption',
        adoption_rate: 0.15,
        tfp_growth_rate: 0.002,
        displacement_rate: 0.10,
        productivity_multiplier: 0.8,
        demand_elasticity: -0.9
    },
    baseline: {
        name: 'Baseline Scenario',
        adoption_rate: 0.23,
        tfp_growth_rate: 0.0025,
        displacement_rate: 0.15,
        productivity_multiplier: 1.0,
        demand_elasticity: -0.8
    },
    aggressive: {
        name: 'Aggressive Adoption',
        adoption_rate: 0.45,
        tfp_growth_rate: 0.004,
        displacement_rate: 0.25,
        productivity_multiplier: 1.5,
        demand_elasticity: -0.6
    },
    disruption: {
        name: 'Technological Disruption',
        adoption_rate: 0.60,
        tfp_growth_rate: 0.006,
        displacement_rate: 0.35,
        productivity_multiplier: 2.0,
        demand_elasticity: -0.4
    }
};

// Load scenario preset
function loadScenarioPreset(presetName) {
    console.log(`🎯 Loading scenario preset: ${presetName}`);
    
    const preset = scenarioPresets[presetName];
    if (!preset) {
        console.error(`❌ Preset not found: ${presetName}`);
        return;
    }
    
    try {
        // Update slider values
        document.getElementById('adoptionRate').value = preset.adoption_rate * 100;
        document.getElementById('tfpRate').value = preset.tfp_growth_rate * 100;
        document.getElementById('displacementRate').value = preset.displacement_rate * 100;
        document.getElementById('productivityMultiplier').value = preset.productivity_multiplier;
        document.getElementById('demandElasticity').value = preset.demand_elasticity;
        
        // Update all slider displays
        document.getElementById('adoptionValue').textContent = (preset.adoption_rate * 100).toFixed(0) + '%';
        document.getElementById('tfpValue').textContent = (preset.tfp_growth_rate * 100).toFixed(2) + '%';
        document.getElementById('displacementValue').textContent = (preset.displacement_rate * 100).toFixed(0) + '%';
        document.getElementById('productivityValue').textContent = preset.productivity_multiplier.toFixed(1) + 'x';
        document.getElementById('elasticityValue').textContent = preset.demand_elasticity.toFixed(1);
        
        console.log(`✅ Loaded ${preset.name} scenario parameters`);
        runSimulation();
    } catch (error) {
        console.error('❌ Error loading preset:', error);
    }
}

// Add scenario preset buttons to sidebar
function addScenarioPresets() {
    console.log('🎛️ Adding scenario presets...');
    
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) {
        console.warn('⚠️ Sidebar not found, skipping preset buttons');
        return;
    }
    
    const presetContainer = document.createElement('div');
    presetContainer.className = 'parameter-group';
    presetContainer.innerHTML = `
        <h4 style="margin-bottom: var(--space-12); color: var(--color-primary);">📋 Scenario Presets</h4>
        <div class="flex flex-col gap-4">
            <button class="btn btn--outline btn--sm" onclick="loadScenarioPreset('conservative')" title="Low adoption, conservative estimates">🐌 Conservative</button>
            <button class="btn btn--outline btn--sm" onclick="loadScenarioPreset('baseline')" title="Current parameter settings">📊 Baseline</button>
            <button class="btn btn--outline btn--sm" onclick="loadScenarioPreset('aggressive')" title="High adoption, optimistic projections">🚀 Aggressive</button>
            <button class="btn btn--outline btn--sm" onclick="loadScenarioPreset('disruption')" title="Rapid transformation scenario">⚡ Disruption</button>
        </div>
    `;
    
    // Insert before the advanced controls
    const advancedControls = sidebar.querySelector('.advanced-controls');
    if (advancedControls) {
        sidebar.insertBefore(presetContainer, advancedControls);
        console.log('✅ Scenario presets added before advanced controls');
    } else {
        sidebar.appendChild(presetContainer);
        console.log('✅ Scenario presets added to end of sidebar');
    }
}

// Initialize tooltip positioning
function initializeTooltips() {
    console.log('💬 Initializing tooltips...');

    const infoIcons = document.querySelectorAll('.param-info-icon');
    let activeTooltip = null;
    let hideTimeout = null;

    infoIcons.forEach(icon => {
        const tooltipId = icon.getAttribute('data-tooltip');
        if (!tooltipId) {
            console.warn('⚠️ Icon missing data-tooltip attribute');
            return;
        }

        const tooltip = document.getElementById(tooltipId);
        if (!tooltip) {
            console.warn(`⚠️ Tooltip not found: ${tooltipId}`);
            return;
        }

        // Position tooltip relative to icon
        const positionTooltip = () => {
            const iconRect = icon.getBoundingClientRect();
            const tooltipWidth = 280;
            const gap = 8;

            // Position to the right of the icon
            let left = iconRect.right + gap;
            let top = iconRect.top + (iconRect.height / 2);

            // Check if would overflow right edge
            if (left + tooltipWidth > window.innerWidth - 20) {
                // Show on left side instead
                left = iconRect.left - tooltipWidth - gap;
            }

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            tooltip.style.transform = 'translateY(-50%)';
        };

        // Show tooltip immediately
        const showTooltip = () => {
            // Clear any pending hide
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }

            // Hide any other active tooltip
            if (activeTooltip && activeTooltip !== tooltip) {
                activeTooltip.style.opacity = '0';
                activeTooltip.style.visibility = 'hidden';
            }

            // Show this tooltip
            positionTooltip();
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
            activeTooltip = tooltip;
        };

        // Hide tooltip after delay
        const hideTooltip = () => {
            hideTimeout = setTimeout(() => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
                if (activeTooltip === tooltip) {
                    activeTooltip = null;
                }
            }, 500); // 500ms delay
        };

        // Cancel hide if mouse re-enters
        const cancelHide = () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
        };

        // Mouse events on icon
        icon.addEventListener('mouseenter', showTooltip);
        icon.addEventListener('mouseleave', hideTooltip);

        // Mouse events on tooltip itself
        tooltip.addEventListener('mouseenter', cancelHide);
        tooltip.addEventListener('mouseleave', hideTooltip);

        // Keyboard support
        icon.addEventListener('focus', showTooltip);
        icon.addEventListener('blur', hideTooltip);
    });

    console.log(`✅ Initialized ${infoIcons.length} tooltips`);
}

// Enhanced initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing AI Economic Impact Simulator...');

    try {
        initializeTabs();
        console.log('✅ Tabs initialized');

        initializeSliders();
        console.log('✅ Sliders initialized');

        setupEventListeners();
        console.log('✅ Event listeners setup');

        initializeCharts();
        console.log('✅ Charts initialized');

        addScenarioPresets();
        console.log('✅ Scenario presets added');

        initializeTooltips();
        console.log('✅ Tooltips initialized');

        // Initialize interactions after a short delay
        setTimeout(() => {
            initializeInteractions();
            console.log('✅ Chart interactions initialized');
        }, 200);

        runInitialSimulation();
        console.log('✅ Initial simulation triggered');
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        alert(`Initialization Error: ${error.message}`);
    }
    
    // Show helpful tips
    setTimeout(() => {
        console.log('\n🎉 AI Economic Impact Simulator Ready!');
        console.log('💡 Tips:');
        console.log('  • Adjust sliders to see real-time parameter changes');
        console.log('  • Use keyboard shortcuts: Ctrl+R (run), Ctrl+E (export), Ctrl+D (reset)');
        console.log('  • Switch between tabs to explore different analyses');
        console.log('  • Check console for detailed simulation logs');
        console.log('📊 Simulation engine ready - adjust parameters to see economic impacts!');
    }, 1500);
});
