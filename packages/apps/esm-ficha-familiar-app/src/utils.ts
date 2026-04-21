export const formatPatientName = (patient): string => {
  if (!patient || !patient.name || patient.name.length === 0) {
    return '';
  }
  const nameObj = patient.name[0];
  if (nameObj.text) {
    return nameObj.text;
  }
  const givenNames = nameObj.given ? nameObj.given.join(' ') : '';
  const familyName = nameObj.family || '';
  return `${familyName} ${givenNames}`.trim();
};
