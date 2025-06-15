const Simulation = require('../simulation/Simulation');

describe('Simulation', () => {
  it('runs a quarter and updates economic metrics', () => {
    const sim = new Simulation();
    const prevQuarter = sim.state.quarter;
    sim.runQuarter();
    expect(sim.state.quarter).toBe(prevQuarter + 1);
    expect(sim.state.economy.gdp).toBeGreaterThan(1000);
    expect(sim.state.economy.purchasingPower).toBeGreaterThan(0);
  });
});
