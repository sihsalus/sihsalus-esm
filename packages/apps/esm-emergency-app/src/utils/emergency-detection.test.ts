import { isEmergencyLocation } from './emergency-detection';

const EMERGENCY_UUID = 'emerg-uuid-123';
const UPSS_UUID = 'upss-emerg-uuid-456';

describe('isEmergencyLocation', () => {
  it('returns false when no location UUID is provided', () => {
    expect(isEmergencyLocation(undefined, undefined, EMERGENCY_UUID, UPSS_UUID)).toBe(false);
    expect(isEmergencyLocation(null, null, EMERGENCY_UUID, UPSS_UUID)).toBe(false);
  });

  it('returns false when locationUuid is "all"', () => {
    expect(isEmergencyLocation('all', 'Emergency', EMERGENCY_UUID, UPSS_UUID)).toBe(false);
  });

  it('matches by primary emergency location UUID', () => {
    expect(isEmergencyLocation(EMERGENCY_UUID, undefined, EMERGENCY_UUID, UPSS_UUID)).toBe(true);
  });

  it('matches by UPSS emergency location UUID', () => {
    expect(isEmergencyLocation(UPSS_UUID, undefined, EMERGENCY_UUID, UPSS_UUID)).toBe(true);
  });

  it('matches by name containing "emergency" (case-insensitive)', () => {
    expect(isEmergencyLocation('other-uuid', 'Emergency Department', null, null)).toBe(true);
    expect(isEmergencyLocation('other-uuid', 'EMERGENCY ROOM', null, null)).toBe(true);
  });

  it('matches by name containing "emergencia" (Spanish)', () => {
    expect(isEmergencyLocation('other-uuid', 'UPSS - EMERGENCIA', null, null)).toBe(true);
    expect(isEmergencyLocation('other-uuid', 'Emergencias', null, null)).toBe(true);
  });

  it('matches normalized name "upss emergencia"', () => {
    expect(isEmergencyLocation('other-uuid', 'UPSS - EMERGENCIA', null, null)).toBe(true);
    expect(isEmergencyLocation('other-uuid', 'upss_emergencia', null, null)).toBe(true);
  });

  it('returns false for non-emergency locations', () => {
    expect(isEmergencyLocation('other-uuid', 'Consulta Externa', null, null)).toBe(false);
    expect(isEmergencyLocation('other-uuid', 'Laboratorio', null, null)).toBe(false);
    expect(isEmergencyLocation('other-uuid', 'Farmacia', null, null)).toBe(false);
  });

  it('returns false when UUID does not match and no name provided', () => {
    expect(isEmergencyLocation('other-uuid', undefined, EMERGENCY_UUID, UPSS_UUID)).toBe(false);
  });

  it('prioritizes UUID match over name match', () => {
    // UUID matches emergency, even though name says "Farmacia"
    expect(isEmergencyLocation(EMERGENCY_UUID, 'Farmacia', EMERGENCY_UUID, UPSS_UUID)).toBe(true);
  });
});
