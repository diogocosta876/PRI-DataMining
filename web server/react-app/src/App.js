import React, { useState } from 'react';
import './App.css';
import Search from './components/Search';
import CustomQueries from './components/CustomQueries';
import Sidebar from './components/Sidebar';
import CustomQuerySidebar from './components/CustomQuerySidebar';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isCustomQuerySidebarOpen, setIsCustomQuerySidebarOpen] = useState(false);
  const [customQueryResults, setCustomQueryResults] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState("");

  const handleSuggestionClick = (medicine) => {
    setSelectedMedicine(medicine);
    setIsSidebarOpen(true);
  };

  const handleQuerySelect = (data, query) => {
    setCustomQueryResults(data);
    setSelectedQuery(query);
    setIsCustomQuerySidebarOpen(true); // Open the CustomQuerySidebar
    setIsSidebarOpen(false); //lose the other sidebar if open
    console.log("selected query: ", query);
  };

  return (
    <div className="App">
      <div className="background-image"></div>
      <div className="overlay"></div>
      <div className="container">
        <h1 className="title">Pesquisa<span className="heart">♥</span>Med</h1>
        <Search onSuggestionSelect={handleSuggestionClick}/>
      </div>
      <CustomQueries onQuerySelect={handleQuerySelect} />
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} medicine={selectedMedicine} />
      <CustomQuerySidebar 
  isOpen={isCustomQuerySidebarOpen} 
  closeSidebar={() => setIsCustomQuerySidebarOpen(false)} 
  query={selectedQuery}
  queryResults={customQueryResults} 
/>
    </div>
  );
}

export default App;
