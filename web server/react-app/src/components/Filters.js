// Filters.js
import React from 'react';
import './Filters.css'; // Make sure to create a corresponding CSS file

const Filters = ({ onAdminRouteChange, onSortByChange, adminRoute, sortBy }) => {
    return (
      <div className="filters-container">
        {/* ... other filter groups */}
        <div className="filter-group">
          <label htmlFor="administration-route">Via de administração:</label>
          <select
            id="administration-route"
            name="administration-route"
            value={adminRoute}
            onChange={(e) => onAdminRouteChange(e.target.value)}
          >
            <option value="oral">Via Oral</option>
            <option value="intravenous">Via Intravenosa</option>
            <option value="via3">Via 3</option> {/* Replace "via3" with actual value */}
            <option value="via4">Via 4</option> {/* Replace "via4" with actual value */}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="sort-by">Sort by:</label>
          <select
            id="sort-by"
            name="sort-by"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="relevance">Relevance</option>
            <option value="clicks">Clicks</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>
    );
  };
  
  export default Filters;