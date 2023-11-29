import React from 'react';

function Suggestions({ medicines, onSuggestionClick }) {
  if (!medicines.length) {
    return null;
  }

  return (
    <div id="searchResults" className="suggestions">
      {medicines.map((medicine) => (
        <div key={medicine.id || medicine.name} onClick={() => onSuggestionClick(medicine.name)}>
          {medicine.name}
        </div>
      ))}
    </div>
  );
}

export default Suggestions;