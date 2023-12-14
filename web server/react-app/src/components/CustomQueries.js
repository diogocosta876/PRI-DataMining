import React from 'react';
import './CustomQueries.css';
import questionIcon from '../assets/question_icon.png'; // Replace with actual path to icon

const queryData = [
  {
    title: 'Medicamentos proibidos durante a amamentação/gravidez',
    query: `(Antes_de_utilizar:amamentar~3 AND (Antes_de_utilizar:"amamentação não"~4))
    OR (Antes_de_utilizar:aleitamento AND (Antes_de_utilizar:"aleitamento não"~4))
    OR (Antes_de_utilizar:gravidez AND (Antes_de_utilizar:"grávida não"^2~4))`
  },
  {
    title: 'Antibióticos mais adequados para uma infeção específica',
    query: `(O_que_e_e_para_que_e_utilizado:antibiotico)
    AND (O_que_e_e_para_que_e_utilizado:infecao^2~4))
    AND (O_que_e_e_para_que_e_utilizado:maxil* )`
  },
  {
    title: 'Medicação para doenças mentais',
    query: `O_que_e_e_para_que_e_utilizado:"Doenca
    mental"~0 OR
    O_que_e_e_para_que_e_utilizado:depressao OR
    O_que_e_e_para_que_e_utilizado:problemas
    mentais OR
    O_que_e_e_para_que_e_utilizado:esquizofrenia
    OR O_que_e_e_para_que_e_utilizado:ansiedade OR
    O_que_e_e_para_que_e_utilizado:stress OR
    O_que_e_e_para_que_e_utilizado:perturbaç* OR
    O_que_e_e_para_que_e_utilizado:obsess* OR
    O_que_e_e_para_que_e_utilizado:compuls*`
  },
  {
    title: 'Medicação para doenças pulmonares ou cardíacas',
    query: `(O_que_e_e_para_que_e_utilizado:
      "doença coração"^2~3 OR
      O_que_e_e_para_que_e_utilizado: "doença
      pulmonar"~3) AND Antes_de_utilizar:"não
      crianças"~6`
  }
];
function CustomQueries({ onQuerySelect }) {
  const fetchMedicines = async (query, title) => {
    try {
      const response = await fetch('/search?q=' + encodeURIComponent(query));
      const data = await response.json();
      onQuerySelect(data, title); 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleQueryClick = (query, title) => {
    fetchMedicines(query, title);
  };

  return (
    <section className="custom-queries">
      {queryData.map((item, index) => (
        <div key={index} className="query-card" onClick={() => handleQueryClick(item.query, item.title)}>
          <img src={questionIcon} alt="Query Icon" className="query-icon" />
          <span className="query-title">{item.title}</span>
        </div>
      ))}
    </section>
  );
}

export default CustomQueries;