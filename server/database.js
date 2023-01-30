const mongoose = require('mongoose');
const logger = require('./config/logger');

//mongodb://root:Rm3MpB4vR5AXPL@172.22.4.106:6400/?authMechanism=DEFAULT&tls=false&tlsInsecure=true&directConnection=true
exports.connect = (
        {
          protocol = 'mongodb',
          url,
          username='',
          password = ''
        },
        options={}
        )=>{
        let dburl = '';

        //Required auth
        if (username && password) {
          dburl=`${protocol}://${username}:${password}@${url}`;
        }else{
          dburl= `${protocol}://${url}`;
        }
        
        mongoose.connect('mongodb://root:Rm3MpB4vR5AXPL@localhost:6400/?authMechanism=DEFAULT', {
          ...options,
          useNewUrlParser:true,
          useCreateIndex:true,
          useUnifiedTopology:true
        });

        mongoose.connection.on('open',()=>{
          logger.info('Base de datos conectada');
        });

        mongoose.connection.on('close',()=>{
          logger.info('Base de datos desconectada');
        });

        mongoose.connection.on('error',(err)=>{
          logger.info(`Error en la coneccion de Base de datos: ${err}`);
        });

        process.on('SIGINT', ()=>{
          mongoose.connection.close(()=>{
            logger.info('Database connection disconnected through app termination');
            process.exit(0);
          });
        });

        exports.disconnect = () =>{
          mongoose.connection.close(()=>{
            logger.info('Base de datos desconectada')
          });
        };


      }
