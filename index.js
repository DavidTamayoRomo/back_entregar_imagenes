
const http = require('http');
const https = require('https');
const fs = require('fs');

const app = require('./server');
const config = require('./server/config');
const database = require('./server/database');

const options = {
  key: fs.readFileSync('./certs/key.key'),
  cert: fs.readFileSync('./certs/certificate.crt')
}

//Connect to database
database.connect(config.database, {});

const port = 5050;
const server = http.createServer(app);

const serverHttps = https.createServer(options, app);

serverHttps.listen(5043, () => {
  console.log(`Server corriendo en el puerto 5043`);
});

server.listen(port, () => {
  console.log(`Server corriendo en el puerto ${port}`);
});

