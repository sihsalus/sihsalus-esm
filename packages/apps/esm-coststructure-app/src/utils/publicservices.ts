export function calculateInductor(consumption: number, totalAreaM2: number): number {
  return consumption * totalAreaM2;
}

export function calculateAsignedCost(annualCost: number, totalInductor: number, inductor: number): number {
  if (totalInductor === 0) return 0;
  return (inductor / totalInductor) * annualCost;
}

export function calculateTotalInductor(inductors: number[]): number {
  return inductors.reduce((acc, curr) => acc + curr, 0);
}

export function calculateAsignedCostGeneral(annualCost: number, totalAreaM2: number, areaM2: number): number {
  if (totalAreaM2 === 0) return 0;
  return (areaM2 / totalAreaM2) * annualCost;
}

export function calculateUnitCostService(asignedCost: number, productionProyected: number): number {
  if (productionProyected <= 0) return 0;
  return asignedCost / productionProyected;
}
