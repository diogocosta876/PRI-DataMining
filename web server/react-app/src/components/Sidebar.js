import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isOpen, closeSidebar, medicine }) => {
    const sidebarClass = isOpen ? "sidebar open" : "sidebar";

    const handleDownload = () => {
      const fileName = medicine?.name.replace(/\s+/g, '_'); // Replace spaces with underscores or however your files are named
      const url = `http://localhost:3001/download/${encodeURIComponent(fileName)}`;
      window.open(url, '_blank');
    };
  

    return (
      <div className={sidebarClass}>
        <div className="sidebar-header">
          <button onClick={closeSidebar} className="close-button">&larr;</button>
          <h2 className="sidebar-title">{medicine?.name}</h2>
        </div>
        <div className="sidebar-content">
          <p><strong>Nº Processo:</strong> {medicine?.processNumber}</p>
          <div className='col-item'><strong>Laboratório Responsável</strong> {medicine?.marketingAuthorizationHolder}</div>
          <div className='col-item'><strong>Substância(s) Ativa(s)</strong> {medicine?.activeSubstance}</div>
          
          <div className="sidebar-section">
            <h3>Detalhes</h3>
            <p><strong>Forma Farmacêutica:</strong> {medicine?.pharmaceuticalForm}</p>
            <p><strong>Autorizado:</strong> {medicine?.productAuthorizationCountry}</p>
            <p><strong>Início de Produção:</strong> {medicine?.date}</p>
          </div>
          
          {/* Indications Section */}
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
          
         
          
          <p><strong>Menor Preço de Comercialização: </strong> {medicine?.lowestPVP !== 'Not Available' ? `${ medicine?.lowestPVP}€` : 'Not Available'}</p>
        </div>
        <div className="sidebar-footer">
          <button className="info-button" onClick={handleDownload}>Bula Informativa</button>
        </div>
      </div>
    );
  };

export default Sidebar;
