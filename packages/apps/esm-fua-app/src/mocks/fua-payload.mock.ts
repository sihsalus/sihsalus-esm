import type { FuaPayload } from '../types';

export const mockFuaPayload: FuaPayload = {
  paciente: {
    nombres: 'Juan Carlos',
    apellidos: 'Quispe Mamani',
    tipoDocumento: 'DNI',
    numeroDocumento: '12345678',
    fechaNacimiento: '1985-03-15',
    sexo: 'M',
    telefono: '987654321',
    direccion: 'Av. Los Andes 123',
    departamento: 'Puno',
    provincia: 'Puno',
    distrito: 'Puno',
  },
  seguro: {
    tipo: 'SIS',
    numeroAfiliacion: 'SIS-123456789',
    regimenSIS: 'GRATUITO',
    ipress: '120001',
  },
  encuentro: {
    encounterUuid: 'mock-encounter-uuid',
    visitUuid: 'mock-visit-uuid',
    encounterType: 'Consulta Externa',
    fechaAtencion: new Date().toISOString(),
    medicoUuid: 'mock-medico-uuid',
    medicoNombre: 'Dr. Ana García López',
    establecimientoUuid: 'mock-establecimiento-uuid',
  },
  diagnosticos: [
    {
      cie10Code: 'J06.9',
      cie10Display: 'Infección aguda de las vías respiratorias superiores, no especificada',
      tipoDiagnostico: 'PRINCIPAL',
      condicion: 'NUEVO',
    },
  ],
  procedimientos: [
    {
      codigoProcedimiento: '89.7',
      descripcion: 'Consulta externa',
      cantidad: 1,
    },
  ],
  prescripciones: [
    {
      medicamento: 'Paracetamol 500mg',
      dosis: '500mg',
      frecuencia: 'cada 8 horas',
      duracion: '5 días',
      cantidad: 15,
    },
  ],
};

export const mockFuaRequest = {
  id: 'mock-fua-001',
  uuid: 'mock-fua-uuid-001',
  estado: 'PENDIENTE' as const,
  patientUuid: 'mock-patient-uuid',
  encounterUuid: 'mock-encounter-uuid',
  payload: mockFuaPayload,
  createdAt: new Date().toISOString(),
};
