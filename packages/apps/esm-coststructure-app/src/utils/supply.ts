export function calculateUnitCostSupply(adquisitionPrice: number, equivalence: number) {
  if (!equivalence || equivalence <= 0) return 0;
  return adquisitionPrice / equivalence;
}

export function calculateStandarCostSupply(unitCost: number, quantity: number, minutes?: number) {
  if (minutes === undefined) minutes = 1;
  return unitCost * quantity * minutes;
}
