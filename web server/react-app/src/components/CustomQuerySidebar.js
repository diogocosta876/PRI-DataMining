import React, { useState } from 'react';
import './Sidebar.css';
import './CustomQuerySidebar.css';

const QueryResultSidebar = ({ isOpen, closeSidebar, queryResults, query }) => {
  const [filter, setFilter] = useState('');
  const filteredResults = queryResults.filter((result) =>
    result.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  const sidebarClass = isOpen ? "sidebar open" : "sidebar";

  return (
    <div className={sidebarClass}>
      <div className="sidebar-header">
        <button onClick={closeSidebar} className="close-button">&larr;</button>
        <h2 className="sidebar-title">Pesquisa</h2>
      </div>
      <div className="query">{query}</div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquisar Medicamento"
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="sidebar-content">
        {filteredResults.map((result, index) => (
          <div key={index} className="query-result-item">
            <span >{result.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueryResultSidebar;