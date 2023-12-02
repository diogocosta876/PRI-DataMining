import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import Suggestions from './Suggestions';
import Loading from './Loading';
import searchIcon from '../assets/search_icon.png';
import './Search.css';

function Search({ onSuggestionSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSuggestionClick = (medicine) => {
    setSearchQuery(medicine.name);
    onSuggestionSelect(medicine);
  };
  
  const suggestionsComponent = medicines.length > 0 && !loading ? (
    <Suggestions medicines={medicines} onSuggestionClick={handleSuggestionClick} />
  ) : null;


  const fetchMedicines = async (query) => {
    setLoading(true);
    try {
      const response = await fetch('/search?q=Product_name:' + encodeURIComponent(query));
      const data = await response.json();
      console.log(data);
      setMedicines(data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  // Use useCallback to memoize the debounced version of fetchMedicines
  const debouncedFetchMedicines = useCallback(debounce(fetchMedicines, 500), []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setMedicines([]);
      return;
    }

    debouncedFetchMedicines(searchQuery);

    return () => {
      debouncedFetchMedicines.cancel();
    };
  }, [searchQuery, debouncedFetchMedicines]);


  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="search-container">
      <div className="input-row">
        <input
          type="text"
          id="medicine-search"
          name="search"
          placeholder="Enter a medicine name"
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button id="search-button" className="icon-button">
          <img src={searchIcon} alt="Search" className="search-icon" />
        </button>
      </div>
      {loading ? <Loading /> : suggestionsComponent}
    </div>
  );
}

export default Search;



