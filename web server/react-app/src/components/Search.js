import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import Suggestions from './Suggestions';
import Loading from './Loading';
import searchIcon from '../assets/search_icon.png';
import './Search.css';

function Search({ onSuggestionSelect, adminRoute, onMedicinesUpdate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displaySuggestions, setDisplaySuggestions] = useState(true);

  const fetchSuggestions = async (query) => {
    setLoading(true);
    try {
      const response = await fetch('/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
    setLoading(false);
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    [] 
  );

  const fetchMedicines = async (query) => {
    try {
      const response = await fetch('/generalSearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, adminRoute })
      });
      const data = await response.json();
      onMedicinesUpdate(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      debouncedFetchSuggestions(searchQuery);
    }
  }, [searchQuery, debouncedFetchSuggestions]);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setDisplaySuggestions(false);
      fetchMedicines(searchQuery);
    }
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
          onKeyPress={handleKeyPress}
        />
        <button id="search-button" className="icon-button">
          <img src={searchIcon} alt="Search" className="search-icon" />
        </button>
      </div>
      {loading ? <Loading /> : (
        <Suggestions 
          medicines={suggestions}
          onSuggestionClick={onSuggestionSelect} 
        />
      )}
    </div>
  );
}

export default Search;