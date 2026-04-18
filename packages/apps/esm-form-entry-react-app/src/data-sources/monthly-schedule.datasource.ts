import { openmrsFetch } from '@openmrs/esm-framework';
import { type OpenmrsResource } from '../types';

interface MonthlyScheduleParams {
  startDate: string;
  endDate: string;
  locationUuids: string;
  limit: number;
  programType: string;
}

type MonthlyScheduleItem = OpenmrsResource & Record<string, unknown>;

/**
 * Data source for monthly appointment schedules.
 * @deprecated — Use customDataSources config instead.
 */
export class MonthlyScheduleDataSource {
  constructor(private appointmentsResourceUrl: string) {}

  async fetchData(_searchTerm?: string, config?: Record<string, unknown>) {
    const monthlyScheduleConfig = asMonthlyScheduleParams(config);
    if (!monthlyScheduleConfig) {
      return [];
    }

    const params = new URLSearchParams({
      startDate: monthlyScheduleConfig.startDate,
      endDate: monthlyScheduleConfig.endDate,
      locationUuids: monthlyScheduleConfig.locationUuids,
      limit: String(monthlyScheduleConfig.limit),
      programType: monthlyScheduleConfig.programType,
      groupBy: 'groupByPerson,groupByAttendedDate,groupByRtcDate',
    });

    const response = await openmrsFetch<Array<MonthlyScheduleItem>>(
      `${this.appointmentsResourceUrl}?${params.toString()}`,
    );
    return response.data;
  }

  fetchSingleItem(_uuid: string): Promise<null> {
    return Promise.resolve(null);
  }

  toUuidAndDisplay(item: MonthlyScheduleItem): OpenmrsResource {
    return { uuid: item.uuid, display: item.display };
  }
}

function asMonthlyScheduleParams(config?: Record<string, unknown>): MonthlyScheduleParams | null {
  if (
    typeof config?.startDate !== 'string' ||
    typeof config?.endDate !== 'string' ||
    typeof config?.locationUuids !== 'string' ||
    typeof config?.limit !== 'number' ||
    typeof config?.programType !== 'string'
  ) {
    return null;
  }

  return {
    startDate: config.startDate,
    endDate: config.endDate,
    locationUuids: config.locationUuids,
    limit: config.limit,
    programType: config.programType,
  };
}
