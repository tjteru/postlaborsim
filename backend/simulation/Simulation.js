class Simulation {
    constructor(state = {}) {
        this.state = Object.assign({
            quarter: 1,
            economy: {
                gdp: 1000,
                unemployment: 5,
                purchasingPower: 1000
            },
            companies: []
        }, state);
    }

    runQuarter(actions = []) {
        this.applyInterdependentEconomy();
        this.applyPurchasingPower();
        this.applyEntrepreneurshipPipeline();
        this.applyCapitalDistribution();
        this.state.quarter += 1;
        return this.state;
    }

    applyInterdependentEconomy() {
        this.state.economy.gdp *= 1.02;
    }

    applyPurchasingPower() {
        const wages = 0.6 * this.state.economy.gdp;
        const profits = 0.4 * this.state.economy.gdp;
        this.state.economy.purchasingPower = wages + profits;
    }

    applyEntrepreneurshipPipeline() {
        this.state.economy.unemployment = Math.max(0, this.state.economy.unemployment - 0.1);
    }

    applyCapitalDistribution() {
        this.state.companies.forEach(c => {
            if (!c.ownership) c.ownership = 'sole_prop';
        });
    }
}

module.exports = Simulation;
