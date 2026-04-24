import { type OpenmrsResource } from '@openmrs/esm-framework/src/internal';
import { type FormContextProps } from '../provider/form-provider';
import {
  type FormField,
  type FormFieldValueAdapter,
  type FormProcessorContextProps,
  type ValueAndDisplay,
} from '../types';

export const ControlAdapter: FormFieldValueAdapter = {
  getDisplayValue: (_field: FormField, value: unknown): unknown => {
    return value;
  },
  transformFieldValue: function (_field: FormField, _value: unknown, _context: FormContextProps): null {
    return null;
  },
  getInitialValue: function (
    _field: FormField,
    _sourceObject: OpenmrsResource,
    _context: FormProcessorContextProps,
  ): null {
    return null;
  },
  getPreviousValue: function (
    _field: FormField,
    _sourceObject: OpenmrsResource,
    _context: FormProcessorContextProps,
  ): ValueAndDisplay | null {
    return null;
  },
  tearDown: function (): void {
    return;
  },
};
