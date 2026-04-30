export const preferredIdentifierNames = ['DNI', 'CE', 'Pasaporte', 'PASS', 'DIE', 'CNV', 'N° Historia Clínica'];

interface MinimalIdentifier {
  identifier?: string;
  identifierType?: { name?: string; display?: string; uuid?: string };
}

export function getPreferredIdentifier<T extends MinimalIdentifier>(identifiers: Array<T> = []): T | undefined {
  return (
    preferredIdentifierNames
      .map((name) =>
        identifiers.find(
          (id) =>
            id?.identifierType?.display?.toLowerCase() === name.toLowerCase() ||
            id?.identifierType?.name?.toLowerCase() === name.toLowerCase(),
        ),
      )
      .find(Boolean) ?? identifiers[0]
  );
}
