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

  console.log(medicines);

  return (
    <div className="search-results">
      {medicines.map((medicine, index) => {
        const rowNum = Math.floor(index / 3);
        const beforeUseInfo = medicine.highlight?.Antes_de_utilizar?.[0] ?? 
                              medicine.highlight?.[0];
  
        return (
            <div key={index} className="medicine-card" style={{ '--row-number': rowNum }}>
            <div className="medicine-card-name">{medicine.name}</div>
            <div className={`medicine-card-description ${!beforeUseInfo ? 'no-highlights' : ''}`}
                 dangerouslySetInnerHTML={{ __html: beforeUseInfo || 'No highlights' }}>
            </div>
            <div className="medicine-card-details">
              <span className="medicine-card-route">Via: {medicine.routeOfAdministration}</span>
              <span className="medicine-card-price">PVP: {medicine.lowestPVP || 'Not Available'}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SearchResults;