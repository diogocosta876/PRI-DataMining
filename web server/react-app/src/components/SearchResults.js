import React from 'react';
import './SearchResults.css'; // Make sure to create a corresponding CSS file

const SearchResults = () => {
  const medicines = [
    { name: 'Medicine 1', description: 'Description 1' },
    { name: 'Medicine 2', description: 'Description 2' },
    { name: 'Medicine 3', description: 'Description 3' },
    { name: 'Medicine 4', description: 'Description 4' },
    { name: 'Medicine 5', description: 'Description 5' },
    { name: 'Medicine 6', description: 'Description 6' },
    { name: 'Medicine 7', description: 'Description 7' },
    { name: 'Medicine 8', description: 'Description 8' },
    { name: 'Medicine 9', description: 'Description 9' }
  ];

  return (
    <div className="search-results">
      {medicines.map((medicine, index) => (
        <div key={index} className="medicine-card">
            <div className="medicine-card-name">Aspifox</div>
            <div className="medicine-card-description">Para que é utilizado: O aspifox é utilizado em muitos casos...dfsssssssssssssssssssssss saaaaaaaaaaaa</div>
            <div className="medicine-card-details">
                <span className="medicine-card-route">Via: Via oral</span>
                <span className="medicine-card-price">PVP: 5€</span>
            </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;