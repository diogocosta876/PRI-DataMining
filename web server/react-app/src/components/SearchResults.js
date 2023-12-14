import React from 'react';
import './SearchResults.css'; // Make sure to create a corresponding CSS file

const SearchResults = ({ medicines, sortBy }) => {

  const sortMedicines = (a, b) => {
    switch (sortBy) {
      case 'relevance':
        // Sorting logic for relevance if you have such data
        break;
      case 'clicks':
        // Sorting logic for clicks if you have such data
        break;
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  };

  if (sortBy) {
    medicines.sort(sortMedicines);
  }

  console.log(sortBy);

  return (
    <div className="search-results">
      {medicines.map((medicine, index) => (
        <div key={index} className="medicine-card">
            <div className="medicine-card-name">{medicine.name}</div>
            <div className="medicine-card-description">{medicine.description}</div>
            {/* Assuming you have route and price data in your medicine objects */}
            <div className="medicine-card-details">
                <span className="medicine-card-route">Via: {medicine.route}</span>
                <span className="medicine-card-price">PVP: {medicine.price}</span>
            </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;