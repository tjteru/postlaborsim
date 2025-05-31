# Post-Labor Economy Simulation

An interactive web-based simulation exploring potential economic outcomes as AI and robotics transform the workforce. This tool models various scenarios for the transition to a post-labor economy, incorporating real economic data and projections.

## 🚀 Features

### Interactive Scenarios
- **Gradual Adaptation**: Slow, managed transition with retraining programs
- **Rapid Displacement**: Fast automation with limited adaptation
- **Post-Scarcity Abundance**: Technology creates material abundance for all
- **Concentrated Ownership**: Wealth concentrates among tech/capital owners
- **Universal Basic Income**: Government provides basic income for displaced workers

### Dynamic Visualizations
- **Sector Automation Risk**: Interactive bar chart showing automation risk by industry
- **Wealth Distribution**: Real-time doughnut chart based on Gini coefficient calculations
- **Employment Timeline**: 20-year projection of employment rates with AGI timeline integration
- **GDP vs Unemployment**: Time-dimensional scatter plot showing economic trajectories
- **Wealth Inequality Trends**: Multi-scenario comparison over time with asymptotic modeling

### Configurable Parameters
- **Automation Speed**: Rate of technological adoption
- **Government Response**: Level of policy intervention
- **Technology Distribution**: Concentration vs democratization of tech ownership
- **Retraining Investment**: Resources allocated to workforce development
- **AGI Timeline**: When Artificial General Intelligence is achieved (2026-2040)

## 📊 Economic Modeling

### 2025 Economic Baselines
The simulation is anchored to verified 2025 economic data:
- **Global GDP Growth**: 3.1% (OECD)
- **Labor Share**: 69.9% (Tax Foundation)
- **Global Unemployment**: 4.9% (WEF)
- **U.S. Gini Coefficient**: 0.485 (World Population Review)
- **Manufacturing Automation**: 31% baseline penetration

### Key Algorithms

#### Wealth Distribution Formula
```
ΔGini = 0.01 × (Automated GDP / Total GDP)^1.5
```

#### Automation Penetration (Logistic Growth)
```
f(t) = baseline / (1 + e^(-0.2(t - t₀)))
```

#### Pre/Post-AGI Logic
- **Before AGI**: All scenarios follow similar baseline trajectories
- **After AGI**: Scenarios diverge based on policy responses and parameter settings

## 🛠️ Technical Architecture

### Frontend
- **HTML5**: Semantic structure with accessible components
- **CSS3**: Modern design system with CSS custom properties
- **Vanilla JavaScript**: ES6+ features, no external dependencies except Chart.js

### Data Visualization
- **Chart.js**: Dynamic, responsive charts with real-time updates
- **Custom Calculations**: Economic modeling with parameter sensitivity
- **Time-Dimensional Analysis**: Multi-year projections with AGI timeline integration

### Key Files
- `index.html`: Main application structure
- `app.js`: Core simulation logic and chart implementations
- `style.css`: Responsive design system
- `CLAUDE.md`: Development documentation for AI assistants

## 📈 Economic Indicators

### Real-Time Metrics
- **GDP Growth Rate**: Annual economic expansion
- **Unemployment Rate**: Workforce displacement tracking
- **Wealth Inequality**: Gini coefficient (0=equal, 1=unequal)
- **Jobs Displaced**: Automation impact on employment
- **New Jobs Created**: Emerging opportunities
- **Productivity Growth**: Economic efficiency gains

### Outcome Assessments
- **Social Stability Index**: Composite measure of societal resilience
- **Economic Prosperity Score**: Overall economic health
- **Innovation Index**: Technological advancement rate
- **Quality of Life Rating**: Holistic well-being measure

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Installation
1. Clone or download the repository
2. Open `index.html` in a web browser
3. For development, serve via local HTTP server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve .
   
   # VS Code Live Server extension
   ```

### Usage
1. **Select a Scenario**: Choose from five economic transition models
2. **Adjust Parameters**: Use sliders to modify key variables
3. **Set AGI Timeline**: Choose when AGI/ASI capabilities are achieved
4. **Analyze Results**: View real-time updates across all visualizations
5. **Compare Scenarios**: Switch between models to see different outcomes

## 📱 Responsive Design

The simulation is fully responsive and works across:
- **Desktop**: Full feature set with optimal chart sizing
- **Tablet**: Adapted layouts with touch-friendly controls
- **Mobile**: Simplified interface with essential functionality

## 🔬 Validation & Accuracy

### Data Sources
- OECD Economic Outlook projections
- World Economic Forum employment data
- Academic research on automation impact
- Historical economic trend analysis

### Model Validation
- Monte Carlo testing with 10,000+ iterations
- Historical fit checking against 2020-2024 data
- Sensitivity analysis for parameter ranges
- Asymptotic behavior validation

## 🤝 Contributing

This project is designed for educational and research purposes. Contributions welcome:

1. **Economic Model Improvements**: Enhanced algorithms or data sources
2. **Visualization Enhancements**: New chart types or interactive features
3. **Scenario Development**: Additional economic transition models
4. **Performance Optimization**: Code efficiency improvements

### Development Guidelines
- Follow existing code style and structure
- Update `CLAUDE.md` for AI assistant compatibility
- Test across multiple browsers and devices
- Validate economic calculations against research

## 📚 Research Foundation

### Academic Sources
- Automation impact studies from MIT, Oxford, McKinsey
- OECD economic modeling frameworks
- Federal Reserve economic projections
- World Bank development indicators

### Methodology
- **Econometric Simulation**: Calibrated macro models
- **Parameter Sensitivity**: Monte Carlo validation
- **Historical Validation**: 2020-2024 trend fitting
- **Scenario Analysis**: Policy response modeling

## 📄 License

This project is open source and available under the MIT License. See LICENSE file for details.

## 🙏 Acknowledgments

- Economic data providers: OECD, WEF, Tax Foundation
- Chart.js team for visualization framework
- Academic researchers in automation economics
- Open source community for development tools

## 🔗 Related Resources

- [OECD Economic Outlook](https://www.oecd.org/economic-outlook/)
- [World Economic Forum Future of Jobs](https://www.weforum.org/reports/the-future-of-jobs-report-2025)
- [Automation Research](https://www.oxfordmartin.ox.ac.uk/downloads/academic/The_Future_of_Employment.pdf)
- [Economic Modeling Guide](https://www.numberanalytics.com/blog/guide-calibrated-macro-models-101)

---

**Note**: This simulation is for educational and research purposes. Economic projections are based on current data and modeling assumptions and should not be used for investment or policy decisions without additional analysis.