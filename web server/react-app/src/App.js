import React, { useState } from 'react';
import './App.css';
import Search from './components/Search';
import CustomQueries from './components/CustomQueries';
import Sidebar from './components/Sidebar';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const handleSuggestionClick = (medicine) => {
    setSelectedMedicine(medicine);
    setIsSidebarOpen(true);
  };

  return (
    <div className="App">
      <div className="background-image"></div>
      <div className="overlay"></div>
      <div className="container">
        <h1 className="title">Pesquisa<span className="heart">♥</span>Med</h1>
        <Search onSuggestionSelect={handleSuggestionClick}/>
      </div>
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} medicine={selectedMedicine} />
      <CustomQueries />
    </div>
  );
}

export default App;