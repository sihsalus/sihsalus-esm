import { type HtmlFormEntryForm } from '../types';

export interface FormEntryProps {
  encounterUuid?: string;
  visitUuid?: string;
  formUuid: string;
  visitTypeUuid?: string;
  visitStartDatetime?: string;
  visitStopDatetime?: string;
  htmlForm?: HtmlFormEntryForm;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalProps?: Record<string, any>;
}
