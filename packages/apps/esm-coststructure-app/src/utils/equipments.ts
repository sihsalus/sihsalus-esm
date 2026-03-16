export function calculateDepreciationMinutes(years: number, price: number) {
  const minutes = years * 365 * 24 * 60;
  return price / minutes;
}

export function calculateCostEquipment(dep: number, minutes: number, quantity: number) {
  return dep * minutes * quantity;
}
