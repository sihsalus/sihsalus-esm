import { useConfig } from '@openmrs/esm-framework';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { useAdmissions } from '../resources/admissions.resource';
import AdmissionHome from './admission-home.component';

jest.mock('../resources/admissions.resource', () => ({
  useAdmissions: jest.fn(),
}));

const mockUseAdmissions = jest.mocked(useAdmissions);
const mockUseConfig = jest.mocked(useConfig);

function renderAdmissionHome() {
  return render(
    <BrowserRouter>
      <AdmissionHome />
    </BrowserRouter>,
  );
}

describe('AdmissionHome', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.getOpenmrsSpaBase = jest.fn(() => '/openmrs/spa/');
    mockUseConfig.mockReturnValue({ admissionReportPageSize: 75 });
  });

  it('renders the admissions by UPS report with accreditation columns', () => {
    mockUseAdmissions.mockReturnValue({
      admissions: [
        {
          uuid: 'visit-1',
          patientUuid: 'patient-1',
          startDatetime: '2026-05-09T08:30:00.000-0500',
          patientName: 'Ada Lovelace',
          medicalRecordNumber: 'HC-99',
          service: 'Consulta externa',
          location: 'Admision Central',
          status: 'Activa',
        },
      ],
      error: undefined,
      isLoading: false,
    });

    renderAdmissionHome();

    expect(screen.getByRole('heading', { name: /reporte de admisiones por ups/i })).toBeInTheDocument();
    for (const header of ['Fecha', 'Hora', 'Paciente', 'HC', 'UPS/servicio', 'Ubicación', 'Estado']) {
      expect(screen.getByRole('columnheader', { name: header })).toBeInTheDocument();
    }
    expect(screen.getByRole('cell', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'HC-99' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Consulta externa' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /fusionar historias duplicadas/i })).toHaveAttribute(
      'href',
      '/openmrs/spa/admission/merge',
    );
    expect(mockUseAdmissions).toHaveBeenCalledWith(75);
  });

  it('uses the default report page size when config is empty', () => {
    mockUseConfig.mockReturnValue({});
    mockUseAdmissions.mockReturnValue({ admissions: [], error: undefined, isLoading: false });

    renderAdmissionHome();

    expect(mockUseAdmissions).toHaveBeenCalledWith(50);
  });

  it('shows loading and error states', () => {
    mockUseAdmissions.mockReturnValue({ admissions: [], error: new Error('boom'), isLoading: true });

    renderAdmissionHome();

    expect(screen.getByText(/cargando admisiones/i)).toBeInTheDocument();
    expect(screen.getByText(/no se pudo cargar el reporte de admisiones/i)).toBeInTheDocument();
    expect(screen.queryByText(/no se encontraron admisiones recientes/i)).not.toBeInTheDocument();
  });

  it('shows the empty state when no admissions are returned after loading', () => {
    mockUseAdmissions.mockReturnValue({ admissions: [], error: undefined, isLoading: false });

    renderAdmissionHome();

    expect(screen.getByText(/no se encontraron admisiones recientes/i)).toBeInTheDocument();
  });
});
