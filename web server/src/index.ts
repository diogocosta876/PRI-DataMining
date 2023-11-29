import express from 'express';
import path from 'path';
import cors from 'cors';


interface SolrDoc {
  Product_name: string[];
  Active_substance: string;
  Route_of_administration: string;
  Product_authorisation_country: string;
  Marketing_authorisation_holder: string;
  Pharmacovigilance_system_master_file_location: string;
  Pharmacovigilance_enquiries_email_address: string;
  Pharmacovigilance_enquiries_telephone_number: string;
  Lowest_PVP: string;
  Substancia_Ativa_DCI: string;
  Forma_Farmaceutica: string;
  Dosagem: string;
  Titular_de_AIM: string;
  Generico: string;
  Vias_de_Administracao: string;
  Numero_de_Processo: string;
  AIM: string;
  Data: string;
  Classificacao_Quanto_a_Dispensa: string;
  Duracao_do_Tratamento: string;
  O_que_e_e_para_que_e_utilizado: string;
  Como_utilizar: string;
  Efeitos_secundarios: string;
  Como_conservar: string;
  Outras_informacoes: string;
  id: string;
  Antes_de_utilizar: string;
  _version_: number;
}

interface SolrResponse {
  response: {
    docs: SolrDoc[];
  };
}

const app = express();
const port = 3001;

app.use(cors()); //enable cors

app.get('/search', async (req, res) => {
  const query = req.query.q?.toString().toLowerCase() || '';
  const solrUrl = `http://localhost:8983/solr/medicines/select?q=Product_name:${encodeURIComponent(query)}`;

  try {
    const solrResponse = await fetch(solrUrl);
    const solrJson = await solrResponse.json() as SolrResponse;

    const searchResults = solrJson.response.docs.map((doc: SolrDoc) => ({
      name: doc.Product_name[0],
      // ... map other properties you need
    }));

    res.json(searchResults);
  } catch (error) {
    console.error('Error querying Solr:', error);
    res.status(500).send('Error querying Solr');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});