import express from 'express';
import path from 'path';
import cors from 'cors';
import axios from 'axios';
import qs from 'qs';
import bodyParser from 'body-parser';

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
  highlighting: any;
}

interface SolrResponse {
  response: {
    docs: SolrDoc[];
  };
}
interface Medicine {
  name: string;
 
}




const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors()); //enable cors

app.get('/search', async (req, res) => {
  const query = req.query.q?.toString() || '';
  const solrUrl = `http://localhost:8983/solr/medicines/select?q=${encodeURIComponent(query)}`;

  try {
    console.log('Querying Solr:', query);
    const solrResponse = await fetch(solrUrl);
    const solrJson = await solrResponse.json() as SolrResponse;
    console.log('Solr response:', solrJson);

    const searchResults = solrJson.response.docs.map((doc: SolrDoc) => ({
      name: doc.Product_name[0],
      activeSubstance: doc.Active_substance,
      routeOfAdministration: doc.Route_of_administration,
      productAuthorizationCountry: doc.Product_authorisation_country,
      marketingAuthorizationHolder: doc.Marketing_authorisation_holder,
      pharmacovigilanceSystemMasterFileLocation: doc.Pharmacovigilance_system_master_file_location,
      pharmacovigilanceEnquiriesEmailAddress: doc.Pharmacovigilance_enquiries_email_address,
      pharmacovigilanceEnquiriesTelephoneNumber: doc.Pharmacovigilance_enquiries_telephone_number,
      lowestPVP: doc.Lowest_PVP,
      activeSubstanceDCI: doc.Substancia_Ativa_DCI,
      pharmaceuticalForm: doc.Forma_Farmaceutica,
      dosage: doc.Dosagem,
      holderOfAIM: doc.Titular_de_AIM,
      generic: doc.Generico,
      routesOfAdministration: doc.Vias_de_Administracao,
      processNumber: doc.Numero_de_Processo,
      AIM: doc.AIM,
      date: doc.Data,
      classificationRegardingDispensation: doc.Classificacao_Quanto_a_Dispensa,
      durationOfTreatment: doc.Duracao_do_Tratamento,
      whatItIsAndWhatItIsUsedFor: doc.O_que_e_e_para_que_e_utilizado,
      howToUse: doc.Como_utilizar,
      sideEffects: doc.Efeitos_secundarios,
      howToPreserve: doc.Como_conservar,
      otherInformation: doc.Outras_informacoes,
      id: doc.id,
      beforeUsing: doc.Antes_de_utilizar,
      version: doc._version_
    }));

    res.json(searchResults);
  } catch (error) {
    console.error('Error querying Solr:', error);
    res.status(500).send('Error querying Solr');
  }
});

app.post('/generalSearch', async (req, res) => {
  let query = req.body['query'];
  let via_admin = req.body['admin_route'];
  console.log("via_admin: ", via_admin);
  const solrEndpoint = "http://localhost:8983/solr";
  const collection = "medicines";

  const qf = "Antes_de_utilizar^2 O_que_e_e_para_que_e_utilizado^2 Vias_de_Administracao Duracao_do_Tratamento Generico Product_name^4 Substancia_Ativa_DCI^3 Grupo_de_Produto Classificacao_Quanto_a_Dispensa Como_utilizar Efeitos_secundarios Bula";
  const hf = "Antes_de_utilizar O_que_e_e_para_que_e_utilizado Como_utilizar Efeitos_secundarios Bula";

  try {

    // Use the embedding in the Solr query
    const solrUrl = `${solrEndpoint}/${collection}/select`;

    console.log('Searchin with:', query)

    const solrData = {
      "q": query,
      "defType": "edismax",
      "indent": "true",
      "q.op": "OR",
      "qf": qf,
      "rows": "20",
      "hl":"true",
      "hl.method":"unified",
      "hl.fl":hf,
      "qs": "4"
    };

    const solrResponse = await axios.post(solrUrl, qs.stringify(solrData), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Process the Solr response and send back the results
    if (solrResponse.status === 200) {
      const highlighting = solrResponse.data.highlighting;
      const docIds = Object.keys(highlighting); // Get document IDs
      const searchResults = solrResponse.data.response.docs.map((doc, index) => {
        // Construct the basic object from the doc
        let result = {
          name: doc.Product_name ? doc.Product_name[0] : '',
          activeSubstance: doc.Active_substance || '',
          routeOfAdministration: doc.Route_of_administration || '',
          productAuthorizationCountry: doc.Product_authorisation_country || '',
          marketingAuthorizationHolder: doc.Marketing_authorisation_holder || '',
          pharmacovigilanceSystemMasterFileLocation: doc.Pharmacovigilance_system_master_file_location || '',
          pharmacovigilanceEnquiriesEmailAddress: doc.Pharmacovigilance_enquiries_email_address || '',
          pharmacovigilanceEnquiriesTelephoneNumber: doc.Pharmacovigilance_enquiries_telephone_number || '',
          lowestPVP: doc.Lowest_PVP || '',
          activeSubstanceDCI: doc.Substancia_Ativa_DCI || '',
          pharmaceuticalForm: doc.Forma_Farmaceutica || '',
          dosage: doc.Dosagem || '',
          holderOfAIM: doc.Titular_de_AIM || '',
          generic: doc.Generico || '',
          routesOfAdministration: doc.Vias_de_Administracao || '',
          processNumber: doc.Numero_de_Processo || '',
          AIM: doc.AIM || '',
          date: doc.Data || '',
          classificationRegardingDispensation: doc.Classificacao_Quanto_a_Dispensa || '',
          durationOfTreatment: doc.Duracao_do_Tratamento || '',
          whatItIsAndWhatItIsUsedFor: doc.O_que_e_e_para_que_e_utilizado || '',
          howToUse: doc.Como_utilizar || '',
          sideEffects: doc.Efeitos_secundarios || '',
          howToPreserve: doc.Como_conservar || '',
          otherInformation: doc.Outras_informacoes || '',
          id: doc.id || '',
          beforeUsing: doc.Antes_de_utilizar || '',
          version: doc._version_ || '',
          highlight: highlighting[doc.id] || ''
        };
        
        return result;
      });
    
      // Log search results for debugging purposes
      console.log("Medicines found:", searchResults.map((medicine) => medicine.name));
    
      // Send the response back to the client
      res.json(searchResults);
    } else {
      throw new Error(`Solr responded with status: ${solrResponse.status}`);
    }
  } catch (error) {
    console.error('Error querying Solr', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/morelikethis/:id', async (req, res) => {
  const id = req.params.id || '';
  const solrEndpoint = "http://localhost:8983/solr";
  const collection = "medicines";

  const qf = "Antes_de_utilizar^2 O_que_e_e_para_que_e_utilizado^2 Vias_de_Administracao Duracao_do_Tratamento Generico Product_name^4 Substancia_Ativa_DCI^3 Grupo_de_Produto Classificacao_Quanto_a_Dispensa Como_utilizar Efeitos_secundarios Bula";
  const hf = "Antes_de_utilizar O_que_e_e_para_que_e_utilizado Como_utilizar Efeitos_secundarios Bula";

  try {

    // Use the embedding in the Solr query
    const solrUrl = `${solrEndpoint}/${collection}/mlt`;

    console.log('Searchin mlt with:', id)

    const solrData = {
      "q": "id:" + id,
      "mlt": "true",
      "mlt.fl": "Product_name Substancia_Ativa_DCI",
      "mlt.mintf": 1,
      "mlt.mindf": 1,
      "mlt.count": 6,
      "rows": "6"
    };

    const solrResponse = await axios.post(solrUrl, qs.stringify(solrData), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Process the Solr response and send back the results
    if (solrResponse.status === 200) {
      const searchResults = solrResponse.data.response.docs.map((doc, index) => {
        // Construct the basic object from the doc
        let result = {
          name: doc.Product_name ? doc.Product_name[0] : '',
          activeSubstance: doc.Active_substance || '',
          routeOfAdministration: doc.Route_of_administration || '',
          productAuthorizationCountry: doc.Product_authorisation_country || '',
          marketingAuthorizationHolder: doc.Marketing_authorisation_holder || '',
          pharmacovigilanceSystemMasterFileLocation: doc.Pharmacovigilance_system_master_file_location || '',
          pharmacovigilanceEnquiriesEmailAddress: doc.Pharmacovigilance_enquiries_email_address || '',
          pharmacovigilanceEnquiriesTelephoneNumber: doc.Pharmacovigilance_enquiries_telephone_number || '',
          lowestPVP: doc.Lowest_PVP || '',
          activeSubstanceDCI: doc.Substancia_Ativa_DCI || '',
          pharmaceuticalForm: doc.Forma_Farmaceutica || '',
          dosage: doc.Dosagem || '',
          holderOfAIM: doc.Titular_de_AIM || '',
          generic: doc.Generico || '',
          routesOfAdministration: doc.Vias_de_Administracao || '',
          processNumber: doc.Numero_de_Processo || '',
          AIM: doc.AIM || '',
          date: doc.Data || '',
          classificationRegardingDispensation: doc.Classificacao_Quanto_a_Dispensa || '',
          durationOfTreatment: doc.Duracao_do_Tratamento || '',
          whatItIsAndWhatItIsUsedFor: doc.O_que_e_e_para_que_e_utilizado || '',
          howToUse: doc.Como_utilizar || '',
          sideEffects: doc.Efeitos_secundarios || '',
          howToPreserve: doc.Como_conservar || '',
          otherInformation: doc.Outras_informacoes || '',
          id: doc.id || '',
          beforeUsing: doc.Antes_de_utilizar || '',
          version: doc._version_ || '',
          highlight: ''
        };
        
        return result;
      });
    
      // Log search results for debugging purposes
      console.log("Medicines found in mlt:", searchResults.map((medicine) => medicine.name));
    
      // Send the response back to the client
      res.json(searchResults);
    } else {
      throw new Error(`Solr responded with status: ${solrResponse.status}`);
    }
  } catch (error) {
    console.error('Error querying Solr', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/getfacets', async (req, res) => {
  const query_url = `http://localhost:8983/solr/medicines/select?defType=edismax&facet.field=Route_of_administration&facet=true&indent=true&q.op=OR&q=*%3A*&useParams=&wt=json`;

  try {
    console.log('Querying Solr:', query_url);
    const solrResponse = await fetch(query_url);

    let solrJson = await solrResponse.json();
    solrJson = solrJson['facet_counts']['facet_fields']['Route_of_administration']

    console.log('Response:', solrJson)
    res.json(solrJson);
  } catch (error) {
    console.error('Error querying Solr:', error);
    res.status(500).send('Error querying Solr');
  }
});


app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const directoryPath = path.join(__dirname, '..', '..', 'downloaded_pdfs');
  const filenameForDownload = filename.replace(/_/g, ' ');
  const filePath = path.join(directoryPath, filenameForDownload + '.pdf');

  res.setHeader('Content-Disposition', 'inline');
  res.sendFile(filePath, (err) => {
    if (err) {
      // handle error, for example if file does not exist
      res.status(404).send('File not found');
    }
  });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});