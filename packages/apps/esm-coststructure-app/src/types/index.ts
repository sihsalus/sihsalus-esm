export interface CostStructure {
  id: number;
  uuid: string;
  createdDate: number;
  startDate: number;
  endDate: number;
}

export interface AnnualServiceCost {
  id: number;
  uuid: string;
  energyAnnualCost: number;
  generalAdminAnnualCost: number;
  generalServiceAnnualCost: number;
  waterAnnualCost: number;
  phonenetAnnualCost: number;
}

export interface BasicServiceInductors {
  id: number;
  uuid: string;
  energyConsumption: number;
  waterConsumtion: number;
  phoneOrNetConsumption: number;
  waterInductor?: number;
  energyInductor?: number;
  phoneNetInductor?: number;
}
export interface Procedure {
  conceptId: number;
  name: string;
}

export interface Equipment {
  id: number;
  uuid: string;
  name: string;
  usefulLifeYears: number;
}

export interface HumanResource {
  id: number;
  uuid: string;
  speciality: string;
}

export interface Infrastructure {
  id: number;
  uuid: string;
  areaM2: number;
  name: string; // se maneja desde el backend con el Location.name
}

export interface EquipmentCost {
  id: number;
  uuid: string;
  quantity: number;
  timeMinutes: number;
}
export interface InfrastructureCost {
  id: number;
  uuid: string;
  annualUnitDep: number;
  performanceTimeService: number;
  productionProyected: number;
}

export interface HumanResourceCost {
  id: number;
  uuid: string;
  quantity: number;
  timeMinutes?: number;
  costMinutes: number;
  priceMonth: number;
}
