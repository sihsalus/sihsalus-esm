import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockDrugSearchResultApiData } from 'test-utils';
import { useDrugSearch, useDrugTemplates } from './drug-search.resource';
import DrugSearchComboBox from './drug-search-combobox.component';

const mockUseDrugSearch = jest.mocked(useDrugSearch);
const mockUseDrugTemplates = jest.mocked(useDrugTemplates);

jest.mock('./drug-search.resource', () => ({
  ...jest.requireActual('./drug-search.resource'),
  useDrugSearch: jest.fn(),
  useDrugTemplates: jest.fn(),
}));

const mockSetSelectedDrugItem = jest.fn();

describe('DrugSearchComboBox', () => {
  beforeEach(() => {
    mockUseDrugSearch.mockImplementation(() => ({
      isLoading: false,
      drugs: mockDrugSearchResultApiData,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    }));

    mockUseDrugTemplates.mockImplementation(() => ({
      isLoading: false,
      error: null,
      templateByDrugUuid: new Map(),
      isValidating: false,
      mutate: jest.fn(),
    }));
  });

  it('renders DrugSearchComboBox', async () => {
    const user = userEvent.setup();
    renderDrugSearchComboBox();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    await user.type(screen.getByRole('combobox'), 'Aspirin');
    const aspirin81 = screen.getByText(/Aspirin 81mg/i);
    expect(aspirin81).toBeInTheDocument();
    await user.click(aspirin81);
    expect(mockSetSelectedDrugItem).toHaveBeenCalledWith(
      expect.objectContaining({
        display: 'Aspirin 81mg',
      }),
    );
  });
});

function renderDrugSearchComboBox() {
  render(
    <DrugSearchComboBox initialOrderBasketItem={null} setSelectedDrugItem={mockSetSelectedDrugItem} visit={null} />,
  );
}
