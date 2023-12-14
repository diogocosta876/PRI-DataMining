// Filters.js
import React from 'react';
import './Filters.css'; // Make sure to create a corresponding CSS file

const Filters = () => {
  return (
    <div className="filters-container">
      <div className="filter-group">
        <label htmlFor="administration-route">Via de administração:</label>
        <select id="administration-route" name="administration-route">
          <option value="oral">Via Oral</option>
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="sort-by">Sort by:</label>
        <select id="sort-by" name="sort-by">
          <option value="clicks">Clicks</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;