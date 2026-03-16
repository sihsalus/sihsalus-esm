/** Minutos laborables por mes: 150 horas (15 días * 8h + 30 horas extras) * 60 min */
const WORK_MINUTES_PER_MONTH = 9000;

export function calculateCostPerMinuteHumanResource(priceMonth: number): number {
  return priceMonth / WORK_MINUTES_PER_MONTH;
}

export function calculateUnitCostHumanResource(costPerMinute: number, timeMinutes: number, quantity: number): number {
  return costPerMinute * timeMinutes * quantity;
}
