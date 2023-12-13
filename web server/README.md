## How to run 

##Backend

- Initialize Solr Container

### Start up nodejs backend server for REST API  (with nodemon for hot reloading)
- cd "web server"
- yarn install
- npm run dev

### Start up flask backend server to generate semantic embeddings
- cd "web server/flask"
- pip install sentence-transformers
- python3 generate_embeddings.py

### Start up react frontend
- cd "web server/react-app"
- yarn install
- npm start

If there are any runtime errors, install npm dependencies as suggested by the error message.