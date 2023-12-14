import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import Loading from './Loading';
import searchIcon from '../assets/search_icon.png';
import './Search.css';

function Search({ adminRoute, onMedicinesUpdate, sortBy }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMedicines = async (query) => {
    console.log('adminRoute', adminRoute);
    console.log('sortBy', sortBy);
    let sort = sortBy;
    let admin_route = adminRoute;
    if (adminRoute === 'all') {
      admin_route = '';
    }
    if (query === '') {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/generalSearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, admin_route, sort })
      });
      const data = await response.json();
      onMedicinesUpdate(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchMedicines = useCallback(
    debounce((nextQuery) => fetchMedicines(nextQuery), 300),
    [adminRoute, sortBy] // Add sortBy as a dependency
  );

  useEffect(() => {
    if (searchQuery || adminRoute || sortBy) {
      debouncedFetchMedicines(searchQuery);
      onMedicinesUpdate([]); // Clear the list
    }
  }, [searchQuery, adminRoute, sortBy, debouncedFetchMedicines]); // Add sortBy to the dependencies array

  const handleInputChange = (event) => {
    onMedicinesUpdate([]);
    setSearchQuery(event.target.value);
    debouncedFetchMedicines(event.target.value);
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