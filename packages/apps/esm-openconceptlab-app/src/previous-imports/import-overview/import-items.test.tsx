import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { usePagination } from '@openmrs/esm-framework';
import { renderWithSwr } from '@tools/test-helpers';
import { mockImportItems, mockPreviousImports } from '@mocks/openconceptlab.mock';
import { getImportDetails } from './import-items.resource';
import ImportItems from './import-items.component';

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
    expect(screen.getByText('Concept/Mapping')).toBeVisible(), { timeout: 2000 };
  });
}
