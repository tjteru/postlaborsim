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

  it('calculates purchasing power based on GDP', () => {
    const sim = new Simulation({ economy: { gdp: 2000, unemployment: 5, purchasingPower: 0 } });
    sim.runQuarter();
    // GDP should increase by 2%
    expect(sim.state.economy.gdp).toBeCloseTo(2000 * 1.02, 5);
    // Purchasing power equals updated GDP
    expect(sim.state.economy.purchasingPower).toBeCloseTo(sim.state.economy.gdp, 5);
  });

  it('reduces unemployment each quarter', () => {
    const sim = new Simulation();
    sim.state.economy.unemployment = 1;
    sim.runQuarter();
    expect(sim.state.economy.unemployment).toBeLessThan(1);
  });

  it('assigns ownership to companies', () => {
    const sim = new Simulation({ companies: [{ name: 'A' }, { name: 'B', ownership: 'coop' }] });
    sim.runQuarter();
    expect(sim.state.companies[0].ownership).toBe('sole_prop');
    expect(sim.state.companies[1].ownership).toBe('coop');
  });
});
