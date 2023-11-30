import React from 'react';
import './App.css';
import Search from './components/Search';
import CustomQueries from './components/CustomQueries';

function App() {
  return (
    <div className="App">
      <div className="background-image"></div>
      <div className="overlay"></div>
      <div className="container">
        <h1 className="title">Pesquisa<span className="heart">♥</span>Med</h1>
        <Search />
      </div>
      <CustomQueries />
    </div>
  );
}

export default App;