import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { type Concept } from '../../../types';
import { SearchConcept } from './search-concept.component';
import { getConcepts } from './search-concept.resource';

const mockGetConcepts = jest.mocked(getConcepts);

jest.mock('./search-concept.resource.ts', () => {
  const mockGetConcepts = jest.fn().mockImplementation((searchTerm) => {
    if (searchTerm === 'blood sugar') {
      return Promise.resolve(concepts);
    }
    return Promise.resolve([]);
  });
  return {
    getConcepts: mockGetConcepts,
  };
});

const concepts: Concept[] = [
  {
    uuid: '1000AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    units: '',
    answers: [],
    hl7Abbrev: 'ZZ',
    name: 'Whole blood sample',
    description: 'Blood samples not separated into subtypes',
    datatype: {
      uuid: '8d4a4c94-c2cc-11de-8d13-0010c6dffd0f',
      name: 'N/A',
      description: 'Not associated with a datatype (e.g., term answers, sets)',
      hl7Abbreviation: 'ZZ',
    },
  },
  {
    uuid: '2a08da66-f326-4cac-b4cc-6efd68333847',
    units: 'mg/dl',
    answers: [],
    hl7Abbrev: 'NM',
    name: 'BLOOD SUGAR',
    description: 'Laboratory measurement of the glucose level in the blood.',
    datatype: {
      uuid: '8d4a4488-c2cc-11de-8d13-0010c6dffd0f',
      name: 'Numeric',
      description: 'Numeric value, including integer or float (e.g., creatinine, weight)',
      hl7Abbreviation: 'NM',
    },
  },
];

const SearchConceptTestHarness = () => {
  const [searchText, setSearchText] = React.useState('');

  return (
    <SearchConcept
      concept={null}
      setConcept={jest.fn()}
      searchText={searchText}
      setSearchText={setSearchText as React.Dispatch<React.SetStateAction<String>>}
    />
  );
};

describe('Test the concept search component', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be able to search for a concept', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockGetConcepts.mockResolvedValue(concepts);

    render(<SearchConceptTestHarness />);
    const searchInput = screen.getByPlaceholderText('Search Concepts');
    await user.click(searchInput);
    await user.type(searchInput, 'blood s');

    await React.act(async () => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => expect(mockGetConcepts).toHaveBeenCalledWith('blood s'));
    expect(await screen.findByText(concepts[0].name)).toBeInTheDocument();
    expect(await screen.findByText(concepts[1].name)).toBeInTheDocument();
  });

  it('should be able to clear the current search value', async () => {
    const user = userEvent.setup();

    render(<SearchConceptTestHarness />);

    const searchInput = screen.getByPlaceholderText('Search Concepts');
    await user.click(searchInput);
    await user.type(searchInput, 'blood');

    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);
    expect(searchInput).toHaveValue('');
  });
});
