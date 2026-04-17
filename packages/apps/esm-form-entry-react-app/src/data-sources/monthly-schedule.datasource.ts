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

  async fetchData(_searchTerm?: string, config?: MonthlyScheduleParams) {
    if (!config) return [];

    const params = new URLSearchParams({
      startDate: config.startDate,
      endDate: config.endDate,
      locationUuids: config.locationUuids,
      limit: String(config.limit),
      programType: config.programType,
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
