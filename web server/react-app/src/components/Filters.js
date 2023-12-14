// Filters.js
import React from 'react';
import './Filters.css';

const Filters = ({ onAdminRouteChange, onSortByChange, adminRoute, sortBy, filters }) => {
  if (!filters) {
    return filters = [];
  }

    return (
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="administration-route">Via de administração:</label>
          <select
          id="administration-route"
          name="administration-route"
          value={adminRoute}
          onChange={(e) => onAdminRouteChange(e.target.value)}
        >
          <option value="all">All</option>
          {Object.keys(filters).map((key) => (
            <option key={key} value={key}>
              {`${key} (${filters[key]})`}
            </option>
          ))}
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
            <option value="alphabetical">Price</option>
          </select>
        </div>
      </div>
    );
  };
  
  export default Filters;