import type { ReactNode } from 'react';
import { Layer, Search } from '@carbon/react';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import styles from './autosuggest.scss';

interface AutosuggestProps extends React.ComponentProps<typeof Search> {
  getDisplayValue: Function;
  getFieldValue: Function;
  getSearchResults: (query: string) => Promise<Array<Record<string, unknown>>>;
  onSuggestionSelected: (field: string, value: string) => void;
  invalid?: boolean | undefined;
  invalidText?: string | undefined;
  renderEmptyState?: (searchValue: string) => ReactNode;
  renderSuggestionItem?: (item: Record<string, unknown>) => ReactNode;
}

export const Autosuggest: React.FC<AutosuggestProps> = ({
  getDisplayValue,
  getFieldValue,
  getSearchResults,
  onSuggestionSelected,
  invalid,
  invalidText,
  renderEmptyState,
  renderSuggestionItem,
  ...searchProps
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const searchBox = useRef(null);
  const wrapper = useRef(null);
  const { id: name, labelText } = searchProps;

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideComponent);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideComponent);
    };
  }, [wrapper]);

  const handleClickOutsideComponent = (e) => {
    if (wrapper.current && !wrapper.current.contains(e.target)) {
      setSuggestions([]);
      setShowEmptyState(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onSuggestionSelected(name, undefined);

    if (query) {
      getSearchResults(query).then((suggestions) => {
        setShowEmptyState(suggestions.length < 1);
        setSuggestions(suggestions);
      });
    } else {
      setSuggestions([]);
    }
  };

  const handleClear = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSuggestionSelected(name, undefined);
  };

  const handleClick = (index: number) => {
    const display = getDisplayValue(suggestions[index]);
    const value = getFieldValue(suggestions[index]);
    searchBox.current.value = display;
    onSuggestionSelected(name, value);
    setSuggestions([]);
  };

  return (
    <div className={styles.autocomplete} ref={wrapper}>
      <label className="cds--label">{labelText}</label>
      <Layer className={classNames({ [styles.invalid]: invalid })}>
        <Search
          id="autosuggest"
          onChange={handleChange}
          onClear={handleClear}
          ref={searchBox}
          className={styles.autocompleteSearch}
          {...searchProps}
        />
      </Layer>
      {suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={(e) => handleClick(index)}
              role="presentation"
              className={typeof renderSuggestionItem !== 'function' ? styles.displayText : undefined}>
              {typeof renderSuggestionItem === 'function'
                ? renderSuggestionItem(suggestion)
                : getDisplayValue(suggestion)}
            </li>
          ))}
        </ul>
      )}
      {showEmptyState && searchBox.current?.value?.length >= 3 && typeof renderEmptyState === 'function' && (
        <span className={styles.suggestions}>{renderEmptyState(searchBox.current?.value)}</span>
      )}
      {invalid ? <label className={classNames(styles.invalidMsg)}>{invalidText}</label> : <></>}
    </div>
  );
};
