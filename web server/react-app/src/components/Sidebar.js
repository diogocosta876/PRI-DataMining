import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = ({ isOpen, closeSidebar, medicine }) => {
    const [moreLikeThisResults, setMoreLikeThisResults] = useState([]);
    const sidebarClass = isOpen ? "sidebar open" : "sidebar";

    useEffect(() => {
      if (isOpen && medicine?.id) {
        fetchMoreLikeThis(medicine.id);
      }
    }, [isOpen, medicine]);

    const fetchMoreLikeThis = async (id) => {
      console.log('Fetching more like this...', id);
      try {
        const response = await axios.get(`http://localhost:3001/morelikethis/${id}`);
        setMoreLikeThisResults(response.data);
      } catch (error) {
        console.error('Error fetching more like this:', error);
      }
    };

    const handleDownload = () => {
      const fileName = medicine?.name.replace(/\s+/g, '_'); // Replace spaces with underscores or however your files are named
      const url = `http://localhost:3001/download/${encodeURIComponent(fileName)}`;
      window.open(url, '_blank');
    };

    const renderHighlights = () => {
      const highlights = medicine?.highlight;
      if (!highlights) return null;

      return Object.keys(highlights).map((key) => (
        <div key={key} className="sidebar-highlight">
          <h4>{key.replace(/_/g, ' ')}</h4>
          {highlights[key].map((item, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </div>
      ));
    };

    const renderMoreLikeThisResults = () => {
      return moreLikeThisResults.map((result, index) => (
        <div key={index} className="more-like-this-result">
          <h4>{result.name}</h4>
        </div>
      ));
    };
  
    return (
      <div className={sidebarClass}>
        <div className="sidebar-header">
          <button onClick={closeSidebar} className="close-button">&larr;</button>
          <h2 className="sidebar-title2">{medicine?.name}</h2>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3>Informação</h3>
            <p><strong>Nº Processo:</strong> {medicine?.processNumber}</p>
            <div className='col-item'><strong>Laboratório Responsável</strong> {medicine?.marketingAuthorizationHolder}</div>
            <div className='col-item'><strong>Substância(s) Ativa(s)</strong> {medicine?.activeSubstance}</div>
          </div>
          <div className="sidebar-section">
            <h3>Detalhes</h3>
            <p><strong>Forma Farmacêutica:</strong> {medicine?.pharmaceuticalForm}</p>
            <p><strong>Autorizado:</strong> {medicine?.productAuthorizationCountry}</p>
            <p><strong>Início de Produção:</strong> {medicine?.date}</p>
          </div>
          
          <div className="sidebar-section">
            <h3>Indicações</h3>
            <div className="row-item">
                <div className='col-item'><strong>Rota de Administração</strong> {medicine?.routeOfAdministration}</div>
                <div className='col-item'><strong>Dosagem</strong> {medicine?.dosage}</div>
            </div>
            <div className="row-item">
                <div className='col-item'><strong>Duração do Tratamento:</strong> {medicine?.durationOfTreatment}</div>
                <div className='col-item'><strong>Restrições:</strong> {medicine?.classificationRegardingDispensation}</div>
            </div>
          </div>
        </div>
        <strong className='price-label'>Menor Preço de Comercialização:  
          <span className='price'>{medicine?.lowestPVP !== 'Not Available' ? `${ medicine?.lowestPVP}€` : 'Not Available'}</span>
        </strong>
        <h3>Highlights</h3>
        <div className='highlights-section'>
          {renderHighlights()}
        </div>
        <div className="more-like-this-section">
          <h3>Medicamentos Semelhantes</h3>
          {renderMoreLikeThisResults()}
        </div>
        <div className="sidebar-footer">
          <button className="info-button" onClick={handleDownload}>Bula Informativa</button>
        </div>
        
      </div>
    );
  };

export default Sidebar;
