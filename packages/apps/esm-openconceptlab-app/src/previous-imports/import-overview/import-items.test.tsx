import { mockImportItems, mockPreviousImports } from '@mocks/openconceptlab.mock';
import { usePagination } from '@openmrs/esm-framework';
import { screen, waitFor } from '@testing-library/react';
import { renderWithSwr } from '@tools/test-helpers';
import React from 'react';

import ImportItems from './import-items.component';
import { getImportDetails } from './import-items.resource';

const defaultProps = {
  importUuid: mockPreviousImports[1].uuid,
};

const mockGetImportDetails = getImportDetails as jest.Mock;
const mockUsePagination = usePagination as jest.Mock;

jest.mock('./import-items.resource', () => {
  const originalModule = jest.requireActual('./import-items.resource');

  return {
    ...originalModule,
    getImportDetails: jest.fn(),
  };
});

describe('Import items', () => {
  it('renders a tabular overview', async () => {
    mockGetImportDetails.mockReturnValue({ status: 200, ok: true, data: mockImportItems });
    mockUsePagination.mockReturnValue({
      currentPage: 1,
      goTo: () => {},
      results: mockImportItems,
    });
    renderWithSwr(<ImportItems {...defaultProps} />);
    await waitForLoadingToFinish();

    expect(screen.getByText('Concept/Mapping')).toBeVisible();
    expect(screen.getByText('Message')).toBeVisible();
  });

  it('renders the import items correctly', async () => {
    mockGetImportDetails.mockReturnValue({ status: 200, ok: true, data: mockImportItems });
    mockUsePagination.mockReturnValue({
      currentPage: 1,
      goTo: () => {},
      results: mockImportItems,
    });
    renderWithSwr(<ImportItems {...defaultProps} />);
    await waitForLoadingToFinish();

    expect(screen.getByText('Concept/Mapping')).toBeVisible();
    expect(screen.getByText('Message')).toBeVisible();

    mockImportItems.slice(5).forEach((importItem) => {
      expect(screen.getByText(importItem.type + ' ' + importItem.uuid)).toBeVisible();
      expect(screen.getByText(importItem.errorMessage)).toBeVisible();
    });
  });
});

function waitForLoadingToFinish() {
  return waitFor(() => {
    expect(screen.getByText('Concept/Mapping')).toBeVisible();
  });
}
