import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import Loading from './Loading';
import searchIcon from '../assets/search_icon.png';
import './Search.css';

function Search({ adminRoute, onMedicinesUpdate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMedicines = async (query) => {
    setLoading(true);
    try {
      const response = await fetch('/generalSearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, adminRoute })
      });
      const data = await response.json();
      onMedicinesUpdate(data); // This will update the state in the parent component
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchMedicines = useCallback(
    debounce((nextQuery) => fetchMedicines(nextQuery), 300),
    [adminRoute]
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedFetchMedicines(searchQuery);
    }
  }, [searchQuery, debouncedFetchMedicines]);

  const handleInputChange = (event) => {
    onMedicinesUpdate([]); // Clear the medicines list
    setSearchQuery(event.target.value);
    debouncedFetchMedicines(event.target.value); // Call the debounced fetch function
  };

  return (
    <div className="search-container">
      <div className="input-row">
        <input
          type="text"
          id="medicine-search"
          name="search"
          placeholder="Pesquisa"
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button id="search-button" className="icon-button">
          <img src={searchIcon} alt="Search" className="search-icon" />
        </button>
      </div>
      {loading ? <Loading /> : null}
    </div>
  );
}

export default Search;