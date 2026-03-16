/** Minutos en un año: 365 días * 24h * 60min */
const MINUTES_PER_YEAR = 525_600;

export function calculateTotalValidConsruction(areaM2: number, constructionCost: number): number {
  return areaM2 * constructionCost;
}

export function calculateDepreciationByMinutes(totalValueConstruction: number, useFullYears: number = 50): number {
  const useFullYearsInMinutes = useFullYears * MINUTES_PER_YEAR;
  if (useFullYearsInMinutes === 0) return 0;
  return totalValueConstruction / useFullYearsInMinutes;
}

export function calculateInfrastructureStandardCost(
  depreciationPerMinute: number,
  timePerformanceMinutes: number,
): number {
  return depreciationPerMinute * timePerformanceMinutes;
}
