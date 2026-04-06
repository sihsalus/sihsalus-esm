import { openmrsFetch } from '@openmrs/esm-framework';

interface MonthlyScheduleParams {
  startDate: string;
  endDate: string;
  locationUuids: string;
  limit: number;
  programType: string;
}

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

    const response = await openmrsFetch(`${this.appointmentsResourceUrl}?${params.toString()}`);
    return response.data;
  }

  async fetchSingleItem(_uuid: string) {
    return null;
  }

  toUuidAndDisplay(item: any) {
    return { uuid: item?.uuid, display: item?.display };
  }
}
