# AI Economic Impact Monte Carlo Simulator

An interactive Monte Carlo simulation tool for modeling the economic impact of AI adoption across 11 economic sectors. Uses stochastic modeling to generate probabilistic forecasts with confidence intervals, risk metrics, and sectoral analysis.

## Features

- **Monte Carlo Analysis**: Run 100-2,000 iterations with stochastic shocks to model uncertainty
- **11 Economic Sectors**: Professional Services, Financial Services, ICT, Software Development, Healthcare, Manufacturing, Construction, Retail, Transportation, Education, and Other
- **Real-time Parameter Adjustment**: Interactive sliders for adoption rates, productivity, displacement, and more
- **Statistical Analysis**:
  - Confidence intervals (90%)
  - Value at Risk (VaR)
  - Expected Shortfall
  - Probability distributions
- **Scenario Presets**: Conservative, Baseline, Aggressive, and Disruption scenarios
- **Multiple Visualizations**: Distribution charts, time series, sectoral impact, and scenario comparisons
- **Export Capabilities**: Export charts as PNG and data as CSV

## Project Structure

```
montecarlo/
├── index.html           # Main HTML structure and layout
├── styles.css           # Complete CSS design system (1,231 lines)
├── simulator.js         # MonteCarloSimulator class and economic engine
├── ui.js                # UI event handlers and controls
├── charts.js            # Chart.js configurations for visualizations
├── initialization.js    # Application startup and initialization
└── index-original.html  # Original monolithic file (backup)
```

### File Descriptions

**index.html** (~329 lines)
- HTML structure with semantic markup
- Summary cards, parameter controls, tabbed interface
- Chart containers for visualizations
- Loads all external CSS and JavaScript files

**styles.css** (~1,231 lines)
- Complete CSS custom properties system
- Light/dark mode support
- Responsive design for desktop and tablet
- Button, form, card, table, and utility classes
- Design tokens for colors, spacing, typography, shadows

**simulator.js** (~280 lines)
- `MonteCarloSimulator` class
- 11 economic sectors with weights, AI exposure, and base productivity
- Random number generation with seed support
- Box-Muller transform for normal distribution
- Beta distribution approximation
- Single iteration simulation (`runIteration()`)
- Full Monte Carlo analysis (`runSimulation()`)

**ui.js** (~680 lines)
- Slider initialization and event handlers
- Tab switching and navigation
- Parameter display updates
- Scenario preset loading
- Table sorting and filtering
- Export functions

**charts.js** (~689 lines)
- Chart.js initialization and configuration
- Overview charts (GDP distribution, employment impact)
- Time series projections over 5-15 years
- Distribution analysis (histograms)
- Scatter plots (GDP vs. Employment)
- Sectoral analysis bar charts
- Scenario comparison visualizations

**initialization.js** (~287 lines)
- DOMContentLoaded event handler
- Initialization sequence (tabs, sliders, charts, event listeners)
- Scenario preset setup
- Keyboard shortcuts (Ctrl+R: run, Ctrl+E: export, Ctrl+D: reset)
- Initial simulation trigger

## Running the Simulator

This is a static web application that runs entirely in the browser. No build process or server required.

### Option 1: Direct File Access
```bash
# Open in default browser
open index.html
```

### Option 2: Local Server (Recommended)
```bash
# Using Python
python3 -m http.server 8000
# Visit: http://localhost:8000

# Using Node.js
npx serve .
# Visit: http://localhost:3000

# Using VS Code Live Server
# Right-click index.html → "Open with Live Server"
```

## Usage

1. **Adjust Parameters**: Use sliders to set AI adoption rate, TFP growth, job displacement, productivity multiplier, demand elasticity, and time horizon
2. **Choose Preset**: Click scenario buttons (Conservative, Baseline, Aggressive, Disruption) for pre-configured parameter sets
3. **Run Simulation**: Click "Run Simulation" button to execute Monte Carlo analysis
4. **Explore Results**: Switch between tabs to view different analyses:
   - **Overview**: Summary metrics and risk indicators
   - **Charts**: Time series, distributions, and scatter plots
   - **Sectoral Analysis**: Sector-specific impacts with sortable table
   - **Scenario Comparison**: Side-by-side comparison of different scenarios
5. **Export Data**: Use export buttons to save charts (PNG) or data (CSV)

## Key Parameters

- **AI Adoption Rate** (5%-80%): Percentage of workforce tasks affected by AI
- **Annual TFP Growth Rate** (0.05%-0.8%): Total Factor Productivity improvement
- **Job Displacement Rate** (5%-40%): Direct job loss from automation
- **Monte Carlo Iterations** (100-2,000): Number of simulation runs
- **Productivity Multiplier** (0.5x-2.0x): AI productivity enhancement factor
- **Demand Elasticity** (-1.5 to -0.3): Consumer demand response to price changes
- **Time Horizon** (5-15 years): Projection timeframe

## Economic Model

### Core Equations

**GDP Growth with Demand Feedback:**
```
// Supply side (productivity gains)
baseGDPContribution = effectiveAdoption × productivityGain

// Demand side (consumption impacts)
consumptionImpact = -netEmploymentLoss × consumptionLossRate × MPC × laborShare
laborIncomeGain = effectiveAdoption × productivityGain × wealthDistribution × MPC
capitalIncomeGain = effectiveAdoption × productivityGain × (1 - wealthDistribution) × 0.3

// Net effect
netDemandEffect = consumptionImpact + laborIncomeGain + capitalIncomeGain
demandMultiplier = 1 + netDemandEffect

// Final GDP calculation
sectorGDPGrowth = baseGDPContribution × demandMultiplier
totalGDPGrowth = Σ(sectorGDPGrowth × sectorWeight)
```

**Employment Impact:**
```
directDisplacement = effectiveAdoption × employmentLoss
jobCreationEffect = effectiveAdoption × productivityGain × 0.3
netEmploymentLoss = directDisplacement - jobCreationEffect
sectorEmploymentChange = -netEmploymentLoss
totalEmploymentChange = Σ(sectorEmploymentChange × sectorWeight)
```

### Key Economic Mechanisms

**Demand-Side Feedback Loop:**
The model captures the critical relationship between employment and consumer demand:

1. **Consumption Loss from Unemployment**: When workers are displaced, they lose ~95% of their consumption capacity, directly reducing aggregate demand
2. **Marginal Propensity to Consume (MPC)**: Workers spend ~75% of income on consumption, so income changes significantly impact demand
3. **Wealth Concentration**: Productivity gains are distributed asymmetrically (30% to labor, 70% to capital owners)
4. **Capital Owner Spending**: Capital owners have lower MPC (~30%) than workers, so concentrated gains generate less demand

This creates a realistic feedback mechanism where:
- Large-scale job displacement → reduced consumer spending → dampened GDP growth
- Productivity gains to workers → increased spending → amplified GDP growth
- Productivity gains to capital → modest spending increase → limited GDP stimulus

### Stochastic Elements

The simulation incorporates random shocks using normal distributions:
- **Adoption Shock**: N(1.0, 0.1) - bounded [0.5, 1.5]
- **Productivity Shock**: N(1.0, 0.15) - bounded [0.7, 1.3]
- **Displacement Shock**: N(1.0, 0.1) - bounded [0.8, 1.2]

### Sector Data

11 economic sectors with empirically-calibrated parameters:
- **Professional Services**: 8.5% weight, 68% AI exposure, 40% base productivity
- **Financial Services**: 6.2% weight, 65% AI exposure, 25% base productivity
- **ICT Services**: 4.8% weight, 75% AI exposure, 35% base productivity
- **Software Development**: 2.1% weight, 85% AI exposure, 50% base productivity
- **Healthcare**: 14.2% weight, 45% AI exposure, 20% base productivity
- **Manufacturing**: 12.1% weight, 35% AI exposure, 15% base productivity
- **Construction**: 6.8% weight, 25% AI exposure, 10% base productivity
- **Retail**: 10.5% weight, 40% AI exposure, 20% base productivity
- **Transportation**: 5.2% weight, 30% AI exposure, 15% base productivity
- **Education**: 9.1% weight, 50% AI exposure, 25% base productivity
- **Other**: 20.5% weight, 30% AI exposure, 12% base productivity

## Customization

### Modifying Sectors

Edit `simulator.js` lines 4-16 to adjust sector parameters:
```javascript
this.sectors = [
    { name: "Sector Name", weight: 0.085, ai_exposure: 0.68, base_productivity: 0.40 },
    // ... more sectors
];
```
Ensure weights sum to 1.0.

### Changing Economic Formulas

Edit `simulator.js`:
- `runIteration()` method (lines 56-125): Single iteration calculations
- `runSimulation()` method (lines 128-280): Aggregation and statistics

### Styling

Edit `styles.css` custom properties (lines 1-85) for:
- Colors (light/dark mode)
- Typography scales
- Spacing values
- Border radius and shadows
- Animation durations

### Adding Charts

Edit `charts.js` to add new Chart.js visualizations. Follow existing patterns for proper initialization and data binding.

## Technical Details

- **No Dependencies**: All JavaScript runs client-side
- **External Libraries**: Chart.js loaded via CDN
- **Browser Compatibility**: Modern browsers with ES6+ support
- **Performance**: Optimized for up to 2,000 iterations
- **Data Storage**: All calculations in-memory (no backend/database)

## Keyboard Shortcuts

- **Ctrl+R** (Cmd+R on Mac): Run simulation
- **Ctrl+E** (Cmd+E on Mac): Export chart
- **Ctrl+D** (Cmd+D on Mac): Reset to defaults

## Data Sources

Economic baselines validated against 2025 data:
- Global GDP Growth: 3.1% (OECD)
- Labor Share: 60-70%
- Base Unemployment: 4.9% (WEF)

## Development History

This simulator was originally developed as a monolithic 3,488-line single-file application (`index-original.html`). It was refactored into the current modular structure for:
- Improved maintainability
- Easier collaboration
- Better code organization
- Faster debugging and testing

The original file is preserved as `index-original.html` for reference.

## License

Part of the Post-Labor Economy Simulation project.

## Navigation

[← Back to Main Simulation](../index.html)
