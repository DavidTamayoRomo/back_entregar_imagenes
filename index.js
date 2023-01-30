
const http = require('http');

const app = require('./server');
const config = require('./server/config');
const database = require('./server/database');



//Connect to database
database.connect(config.database, {});

const port = 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server corriendo en el puerto ${port}`);
});

