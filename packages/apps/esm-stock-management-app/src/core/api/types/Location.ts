export interface OpenMRSLocation {
  parentLocation: OpenMRSLocation | null;
  id: number;
  uuid: string;
  name: string;
  display: string;
  description: string;
  tags: OpenMRSLocationTag[];
  childLocations: OpenMRSLocation[];
}

export interface OpenMRSLocationTag {
  uuid: string;
  name: string;
  display: string;
}
