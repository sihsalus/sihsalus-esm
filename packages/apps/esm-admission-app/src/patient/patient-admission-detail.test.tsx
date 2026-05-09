import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { usePatientDetail, usePatientVisitHistory } from '../resources/admissions.resource';
import PatientAdmissionDetail from './patient-admission-detail.component';

jest.mock('../resources/admissions.resource', () => ({
  usePatientDetail: jest.fn(),
  usePatientVisitHistory: jest.fn(),
}));

const mockUsePatientDetail = jest.mocked(usePatientDetail);
const mockUsePatientVisitHistory = jest.mocked(usePatientVisitHistory);

function renderPatientAdmissionDetail(route = '/patient/patient-uuid') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/patient/:patientUuid" element={<PatientAdmissionDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PatientAdmissionDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePatientDetail.mockReturnValue({
      patient: {
        person: {
          display: 'Ada Lovelace',
          birthdate: '1990-01-01',
          birthdateEstimated: true,
          gender: 'F',
          age: 36,
          addresses: [{ preferred: true, address1: 'Av. Peru 123', cityVillage: 'Lima', stateProvince: 'Lima' }],
          attributes: [
            { attributeType: { display: 'Grupo sanguineo' }, value: { display: 'O' } },
            { attributeType: { display: 'Factor Rh' }, value: 'Positivo' },
            { value: 'Sin etiqueta' },
          ],
        },
        identifiers: [
          { identifier: 'HC-99', identifierType: { display: 'Historia clinica' }, preferred: true },
          { identifier: '12345678', identifierType: { display: 'DNI' } },
        ],
      },
      error: undefined,
      isLoading: false,
    });
    mockUsePatientVisitHistory.mockReturnValue({
      visits: [
        {
          uuid: 'visit-1',
          startDatetime: '2026-05-09T08:30:00.000-0500',
          service: 'Consulta externa',
          location: 'Admision Central',
          status: 'Activa',
        },
      ],
      error: undefined,
      isLoading: false,
    });
  });

  it('renders filiation data separated from visit/admission history', () => {
    renderPatientAdmissionDetail();

    expect(screen.getByRole('link', { name: /volver a admisiones/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('heading', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(screen.getByTestId('filiation-section')).toBeInTheDocument();
    expect(screen.getByText(/person — separado de datos clínicos/i)).toBeInTheDocument();
    expect(screen.getByText('Historia clinica: HC-99 · DNI: 12345678')).toBeInTheDocument();
    expect(screen.getByText(/estimada/i)).toBeInTheDocument();
    expect(screen.getByText('36 años')).toBeInTheDocument();
    expect(screen.getByText('Femenino')).toBeInTheDocument();
    expect(screen.getByText('Av. Peru 123, Lima, Lima')).toBeInTheDocument();
    expect(screen.getByText('Grupo sanguineo')).toBeInTheDocument();
    expect(screen.getByText('O')).toBeInTheDocument();
    expect(screen.getByText('Factor Rh')).toBeInTheDocument();
    expect(screen.getByText('Positivo')).toBeInTheDocument();
    expect(screen.queryByText('Sin etiqueta')).not.toBeInTheDocument();

    expect(screen.getByTestId('admission-history-section')).toBeInTheDocument();
    expect(screen.getByText(/visit\/encounter — datos clínicos/i)).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'UPS/servicio' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Consulta externa' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Admision Central' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Activa' })).toBeInTheDocument();
    expect(mockUsePatientDetail).toHaveBeenCalledWith('patient-uuid');
    expect(mockUsePatientVisitHistory).toHaveBeenCalledWith('patient-uuid');
  });

  it('shows loading and patient error states', () => {
    mockUsePatientDetail.mockReturnValue({ patient: null, error: new Error('boom'), isLoading: true });
    mockUsePatientVisitHistory.mockReturnValue({ visits: [], error: undefined, isLoading: false });

    renderPatientAdmissionDetail();

    expect(screen.getByText(/cargando paciente/i)).toBeInTheDocument();
    expect(screen.getByText(/no se pudo cargar el paciente/i)).toBeInTheDocument();
  });

  it('shows visit loading, error, and empty states', () => {
    mockUsePatientVisitHistory.mockReturnValueOnce({ visits: [], error: undefined, isLoading: true });
    const { rerender } = renderPatientAdmissionDetail();
    expect(screen.getByText(/cargando historial de ingresos/i)).toBeInTheDocument();

    mockUsePatientVisitHistory.mockReturnValueOnce({ visits: [], error: new Error('boom'), isLoading: false });
    rerender(
      <MemoryRouter initialEntries={['/patient/patient-uuid']}>
        <Routes>
          <Route path="/patient/:patientUuid" element={<PatientAdmissionDetail />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText(/no se pudo cargar el historial de ingresos/i)).toBeInTheDocument();

    mockUsePatientVisitHistory.mockReturnValueOnce({ visits: [], error: undefined, isLoading: false });
    rerender(
      <MemoryRouter initialEntries={['/patient/patient-uuid']}>
        <Routes>
          <Route path="/patient/:patientUuid" element={<PatientAdmissionDetail />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText(/sin historial de ingresos registrado/i)).toBeInTheDocument();
  });
});
