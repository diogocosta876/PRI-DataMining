import React, { useState } from 'react';
import './App.css';
import Search from './components/Search';
import CustomQueries from './components/CustomQueries';
import Sidebar from './components/Sidebar';
import CustomQuerySidebar from './components/CustomQuerySidebar';
import Filters from './components/Filters';
import SearchResults from './components/SearchResults';
import logo from './assets/logo.png'; // Adjust the path according to your project structure


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isCustomQuerySidebarOpen, setIsCustomQuerySidebarOpen] = useState(false);
  const [customQueryResults, setCustomQueryResults] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState("");
  const [activeSidebar, setActiveSidebar] = useState(null);
  const [adminRoute, setAdminRoute] = useState('oral');
  const [sortBy, setSortBy] = useState('relevance');
  const [medicines, setMedicines] = useState([]);


  const handleSuggestionClick = (medicine) => {
    setSelectedMedicine(medicine);
    setIsSidebarOpen(true);
  };
  const handleQuerySelect = (data, query) => {
    setCustomQueryResults(data);
    setSelectedQuery(query);
    setIsCustomQuerySidebarOpen(true); // Open the CustomQuerySidebar
    setActiveSidebar('query');
  };
  const handleMedicineSelect = (medicine) => {
    setSelectedMedicine(medicine);
    setIsSidebarOpen(true);
    setActiveSidebar('medicine');
  };
  const handleMedicinesUpdate = (newMedicines) => {
    setMedicines(newMedicines);
  };
  const handleAdminRouteChange = (route) => {
    console.log('Admin route changed to:', route);
    setAdminRoute(route);
  };
  const handleSortByChange = (sort) => {
    setSortBy(sort);
  };


  return (
    <div className="App">
      <div className="background-image"></div>
      <div className="overlay"></div>
      <div className="container">
        <img src={logo} alt="Logo" className="logo" />
        <Search 
        onSuggestionSelect={handleSuggestionClick}
        adminRoute={adminRoute}
        onMedicinesUpdate={handleMedicinesUpdate}
        />
        <SearchResults sortBy={sortBy} medicines={medicines} />
      </div>
      <section className="left-sidebar">
        <Filters 
         onAdminRouteChange={handleAdminRouteChange}
         onSortByChange={handleSortByChange}
         adminRoute={adminRoute}
         sortBy={sortBy}
        />
        <CustomQueries onQuerySelect={handleQuerySelect} />
      </section>
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
        medicine={selectedMedicine}
        onMedicineSelect={handleMedicineSelect}
        active={activeSidebar === 'query'}
      />
      <CustomQuerySidebar
        isOpen={isCustomQuerySidebarOpen} 
        closeSidebar={() => setIsCustomQuerySidebarOpen(false)}
        medicine={selectedMedicine}
        active={activeSidebar === 'medicine'}
        query={selectedQuery}
        queryResults={customQueryResults} 
        onMedicineSelect={handleMedicineSelect}
      />
    </div>
  );
}

export default App;
