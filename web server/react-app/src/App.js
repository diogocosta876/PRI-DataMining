import React, { useState } from 'react';
import './App.css';
import Search from './components/Search';
import CustomQueries from './components/CustomQueries';
import Sidebar from './components/Sidebar';
import CustomQuerySidebar from './components/CustomQuerySidebar';
import Filters from './components/Filters';
import SearchResults from './components/SearchResults';
import logo from './assets/logo.png';
import { useEffect } from 'react';


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
  const [facets, setFacets] = useState([]);

  useEffect(() => {
    const fetchFacets = async () => {
      try {
        const response = await fetch('http://localhost:3001/getfacets');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const truncatedData = data.slice(0, 30);

        const result = {};
        for (let i = 0; i < truncatedData.length; i += 2) {
          const label = truncatedData[i];
          const value = truncatedData[i + 1];
          result[label] = value;
        }

        setFacets(result);
        return result;
      } catch (error) {
        console.error("Failed to fetch facets: ", error.message);
      }
    };

    fetchFacets();
  }, []); 

  const handleMedicineClick = (medicine) => {
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
        adminRoute={adminRoute}
        onMedicinesUpdate={handleMedicinesUpdate}
        />
        <SearchResults sortBy={sortBy} medicines={medicines} onMedicineClick={handleMedicineClick} />
      </div>
      <section className="left-sidebar">
        <Filters 
         onAdminRouteChange={handleAdminRouteChange}
         onSortByChange={handleSortByChange}
         adminRoute={adminRoute}
         sortBy={sortBy}
         filters={facets}
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
