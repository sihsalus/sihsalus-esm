import { type OpenmrsEncounter } from '../types';
import { getResourceUuid, isPlainObject, isStringValue } from './common-utils';

export function evaluatePostSubmissionExpression(expression: string, encounters: OpenmrsEncounter[]): boolean {
  const encounter = encounters[0];
  const regx = /(?:\w+|'(?:\\'|[^'\n])*')/g;
  let match: RegExpExecArray | null;
  const fieldIds = new Set<string>();
  try {
    while ((match = regx.exec(expression))) {
      const value = match[0].replace(/\\'/g, "'"); // Replace escaped single quotes

      const isBoolean = /^(true|false)$/i.test(value);
      const isNumber = /^-?\d+$/.test(value);
      const isFloat = /^-?\d+\.\d+$/.test(value);

      if (
        !(value.startsWith("'") && value.endsWith("'")) &&
        typeof value === 'string' &&
        !isBoolean &&
        !isNumber &&
        !isFloat
      ) {
        fieldIds.add(value);
      }
    }

    let fieldToValueMap: Record<string, string | undefined> = {};
    let replacedExpression: string;
    if (fieldIds.size) {
      fieldToValueMap = getFieldValues(fieldIds, encounter);
    }

    if (Object.keys(fieldToValueMap).length) {
      replacedExpression = expression.replace(/(\w+)/g, (match): string => {
        return Object.prototype.hasOwnProperty.call(fieldToValueMap, match) ? fieldToValueMap[match] : match;
      });
    } else {
      replacedExpression = expression;
    }

    return Boolean(eval(replacedExpression));
  } catch (error) {
    throw new Error('Error evaluating expression', { cause: error });
  }
}

function getFieldValues(
  fieldIds: Set<string>,
  encounter: OpenmrsEncounter | undefined,
): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  fieldIds.forEach((fieldId) => {
    const rawValue = encounter?.obs?.find((item) => item.formFieldPath?.includes(fieldId))?.value;
    let value: string | undefined;
    if (isPlainObject(rawValue)) {
      value = getResourceUuid(rawValue);
    } else {
      value = formatValue(rawValue);
    }
    result[fieldId] = value;
  });

  return result;
}

//This function wraps string values in single quotes which Javascript will evaluate
function formatValue(value: unknown): string | undefined {
  if (isStringValue(value)) {
    if (value.length >= 2 && value[0] === "'" && value[value.length - 1] === "'") {
      return value;
    } else {
      return `'${value}'`;
    }
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return undefined;
}
