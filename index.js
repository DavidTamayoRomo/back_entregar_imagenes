
const http = require('http');
const https = require('https');
const fs = require('fs');

require('dotenv').config();
const app = require('./server');
const config = require('./server/config');
const database = require('./server/database');


const options = {
  key: fs.readFileSync('./certs/key.key'),
  cert: fs.readFileSync('./certs/certificate.crt')
}


//Connect to database
database.connect(config.database, {});

const port = process.env.SERVER_PORT_HTTP;
const server = http.createServer(app);

const serverHttps = https.createServer(options, app);

serverHttps.listen(process.env.SERVER_PORT_HTTPS, () => {
  console.log(`Server corriendo en el puerto ${process.env.SERVER_PORT_HTTPS}`);
});

server.listen(port, () => {
  console.log(`Server corriendo en el puerto ${port}`);
});

