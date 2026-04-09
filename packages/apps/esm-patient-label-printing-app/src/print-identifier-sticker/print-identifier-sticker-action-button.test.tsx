import { getDefaultsFromConfigSchema } from '@openmrs/esm-framework';
import * as esmFramework from '@openmrs/esm-framework';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { configSchema, type ConfigObject } from '../config-schema';

import PrintIdentifierStickerOverflowMenuItem from './print-identifier-sticker-action-button.component';

let configState: ConfigObject = {
  ...getDefaultsFromConfigSchema(configSchema),
  showPrintIdentifierStickerButton: true,
};

const mockUseConfig = jest.fn(() => configState);
const mockPrintPdf = jest.fn<Promise<void>, [string]>();
let isPrintingState = false;

const showSnackbarSpy = jest.spyOn(esmFramework, 'showSnackbar').mockImplementation(() => undefined);
const userHasAccessSpy = jest
  .spyOn(esmFramework, 'UserHasAccess')
  .mockImplementation(({ children }: React.ComponentProps<typeof esmFramework.UserHasAccess>) => <>{children}</>);
const useConfigSpy = jest.spyOn(esmFramework, 'useConfig').mockImplementation(() => mockUseConfig());

jest.mock('../hooks/useStickerPdfPrinter', () => ({
  useStickerPdfPrinter: () => ({
    printPdf: mockPrintPdf,
    isPrinting: isPrintingState,
  }),
}));

const testPatient = { id: 'test-patient-uuid' } as fhir.Patient;

describe('PrintIdentifierStickerOverflowMenuItem', () => {
  beforeEach(() => {
    configState = {
      ...getDefaultsFromConfigSchema(configSchema),
      showPrintIdentifierStickerButton: true,
    } as ConfigObject;
    isPrintingState = false;
    mockPrintPdf.mockResolvedValue(undefined);
    showSnackbarSpy.mockClear();
    userHasAccessSpy.mockClear();
    useConfigSpy.mockImplementation(() => mockUseConfig());
  });

  it('renders the print button when enabled in config', () => {
    render(<PrintIdentifierStickerOverflowMenuItem patient={testPatient} />);

    expect(screen.getByRole('menuitem', { name: /print identifier sticker/i })).toBeInTheDocument();
  });

  it('does not render the button when disabled in config', () => {
    configState = {
      ...getDefaultsFromConfigSchema(configSchema),
      showPrintIdentifierStickerButton: false,
    } as ConfigObject;

    render(<PrintIdentifierStickerOverflowMenuItem patient={testPatient} />);

    expect(screen.queryByRole('menuitem', { name: /print identifier sticker/i })).not.toBeInTheDocument();
  });

  it('does not render the button when patient ID is missing', () => {
    const patientWithoutId = { ...testPatient, id: undefined } as fhir.Patient;

    render(<PrintIdentifierStickerOverflowMenuItem patient={patientWithoutId} />);

    expect(screen.queryByRole('menuitem', { name: /print identifier sticker/i })).not.toBeInTheDocument();
  });

  it('triggers print when button is clicked', async () => {
    const user = userEvent.setup();
    render(<PrintIdentifierStickerOverflowMenuItem patient={testPatient} />);

    const printButton = screen.getByRole('menuitem', { name: /print identifier sticker/i });
    await user.click(printButton);

    expect(mockPrintPdf).toHaveBeenCalledTimes(1);
    expect(mockPrintPdf).toHaveBeenCalledWith(expect.stringContaining(testPatient.id ?? ''));
  });

  it('shows error notification when print fails', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Network error';
    mockPrintPdf.mockRejectedValueOnce(new Error(errorMessage));

    render(<PrintIdentifierStickerOverflowMenuItem patient={testPatient} />);

    const printButton = screen.getByRole('menuitem', { name: /print identifier sticker/i });
    await user.click(printButton);

    expect(showSnackbarSpy).toHaveBeenCalledTimes(1);
    const payload = showSnackbarSpy.mock.calls[0]?.[0] as {
      kind?: string;
      title?: string;
      subtitle?: string;
    };
    expect(payload.kind).toBe('error');
    expect(payload.title).toBe('Print error');
    expect(payload.subtitle).toContain(errorMessage);
  });

  it('shows loading state when printing', () => {
    isPrintingState = true;

    render(<PrintIdentifierStickerOverflowMenuItem patient={testPatient} />);

    const printButton = screen.getByRole('menuitem', { name: /printing/i });
    expect(printButton).toBeInTheDocument();
    expect(printButton).toBeDisabled();
  });

  it('prevents multiple print calls when already printing', async () => {
    const user = userEvent.setup();
    isPrintingState = true;

    render(<PrintIdentifierStickerOverflowMenuItem patient={testPatient} />);

    const printButton = screen.getByRole('menuitem', { name: /printing/i });
    await user.click(printButton);

    expect(mockPrintPdf).not.toHaveBeenCalled();
  });

  it('checks for the correct privilege when rendering', () => {
    render(<PrintIdentifierStickerOverflowMenuItem patient={testPatient} />);

    expect(userHasAccessSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        privilege: 'App: Can generate a Patient Identity Sticker',
      }),
      expect.anything(),
    );
  });
});
