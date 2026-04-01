import { render, screen } from '@testing-library/react';
import React from 'react';

import { useFuaRequests } from '../hooks/useFuaRequests';

import AllFuaRequestsTile from './all-fua-requests-tile.component';
import CompletedFuaRequestsTile from './completed-fua-requests-tile.component';
import EnviadoFuaRequestsTile from './enviado-fua-requests-tile.component';
import InProgressFuaRequestsTile from './in-progress-fua-requests-tile.component';

jest.mock('../hooks/useFuaRequests');

const mockUseFuaRequests = useFuaRequests as jest.MockedFunction<typeof useFuaRequests>;

const makeMockOrders = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    uuid: `fua-${i}`,
    id: i,
    visitUuid: `visit-${i}`,
    name: `FUA ${i}`,
    payload: '{}',
    fuaEstado: { uuid: `e-${i}`, id: 1, nombre: 'Pendiente' },
    fechaCreacion: Date.now(),
    fechaActualizacion: Date.now(),
  }));

describe('AllFuaRequestsTile', () => {
  it('renders total count', () => {
    mockUseFuaRequests.mockReturnValue({
      fuaOrders: makeMockOrders(7),
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
      isValidating: false,
    });
    render(<AllFuaRequestsTile />);
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('FUAs Solicitados')).toBeInTheDocument();
  });
});

describe('InProgressFuaRequestsTile', () => {
  it('renders in-progress count', () => {
    mockUseFuaRequests.mockReturnValue({
      fuaOrders: makeMockOrders(3),
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
      isValidating: false,
    });
    render(<InProgressFuaRequestsTile />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('En Proceso')).toBeInTheDocument();
  });

  it('passes status IN_PROGRESS to hook', () => {
    mockUseFuaRequests.mockReturnValue({
      fuaOrders: [],
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
      isValidating: false,
    });
    render(<InProgressFuaRequestsTile />);
    expect(mockUseFuaRequests).toHaveBeenCalledWith(expect.objectContaining({ status: 'IN_PROGRESS' }));
  });
});

describe('CompletedFuaRequestsTile', () => {
  it('renders completed count', () => {
    mockUseFuaRequests.mockReturnValue({
      fuaOrders: makeMockOrders(12),
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
      isValidating: false,
    });
    render(<CompletedFuaRequestsTile />);
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});

describe('EnviadoFuaRequestsTile', () => {
  it('renders enviado count', () => {
    mockUseFuaRequests.mockReturnValue({
      fuaOrders: makeMockOrders(5),
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
      isValidating: false,
    });
    render(<EnviadoFuaRequestsTile />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Enviados a SETI-SIS')).toBeInTheDocument();
  });

  it('passes status ENVIADO to hook', () => {
    mockUseFuaRequests.mockReturnValue({
      fuaOrders: [],
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
      isValidating: false,
    });
    render(<EnviadoFuaRequestsTile />);
    expect(mockUseFuaRequests).toHaveBeenCalledWith(expect.objectContaining({ status: 'ENVIADO' }));
  });
});
