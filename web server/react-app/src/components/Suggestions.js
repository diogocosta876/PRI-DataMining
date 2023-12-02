import React from 'react';
import './Suggestions.css';

function Suggestions({ medicines, onSuggestionClick }) {
  if (!medicines.length) {
    return null;
  }

  return (
    <div id="searchResults" className="suggestions">
      {medicines.map((medicine) => (
        <div key={medicine.id || medicine.name} onClick={() => onSuggestionClick(medicine)}>
          {medicine.name}
        </div>
      ))}
    </div>
  );
}

export default Suggestions;