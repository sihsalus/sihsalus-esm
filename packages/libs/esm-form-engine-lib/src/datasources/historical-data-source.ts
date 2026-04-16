export class HistoricalDataSourceService {
  dataSourceMap: Record<string, unknown> = {};

  putObject(key: string, value: unknown): void {
    this.dataSourceMap[key] = value;
  }

  getObject(key: string): unknown {
    return this.dataSourceMap[key];
  }
}
