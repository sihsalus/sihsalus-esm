export enum OclErrorCode {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  CONFLICT = 409,
  UNAVAILABLE = 503,
}

export function isRunningImport(imp: Import): boolean {
  return imp.status === 'RUNNING' && !imp.localDateStopped;
}

export interface Subscription {
  uuid: string;
  url: string;
  token: string;
  subscribedToSnapshot?: boolean;
  validationType?: 'NONE' | 'FULL';
}

export interface Import {
  uuid: string;
  localDateStarted: Date;
  localDateStopped: Date;
  importTime: string;
  errorMessage: string;
  importProgress: number;
  allItemsCount: number;
  addedItemsCount: number;
  errorItemsCount: number;
  ignoredErrorsCount: number;
  updatedItemsCount: number;
  upToDateItemsCount: number;
  retiredItemsCount: number;
  unretiredItemsCount: number;
  status: string;
}

export interface ImportItem {
  uuid: string;
  errorMessage: string;
  type: 'CONCEPT' | 'MAPPING';
  versionUrl: string;
  updatedOn: Date;
  state: 'ADDED' | 'UPDATED' | 'RETIRED' | 'UNRETIRED' | 'ERROR' | 'IGNORED_ERROR' | 'UP_TO_DATE' | 'DUPLICATE';
}
