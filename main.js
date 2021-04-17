import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { urlencoded, json } from 'body-parser';
import { socketMain } from './src/services/socket';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'http';

//Direct imports
//Serial port module
import './src/services/serialPort';

//Vars
const port = process.env.PORT || 3000;
const app  = express();
const http = Server(app);
const io   = require('socket.io')(http);

//Http routs
import routes from './src/routes/routes';

//Config
app.use( urlencoded({ extended: false }) );
app.use( json() );
app.use( cors() );
dotenv.config();

// Iniciar mongoose
mongoose.connect(process.env.mongoUrl, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false 
}).then(() => {
        console.log("Conectado a mongodb");
    }, (err) => { console.log(err); });

//Http
app.use('/', routes);
app.use('/', (req, res) => {res.send({msg: 'Funcionando'})});

//Socket
io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token){
      jwt.verify(socket.handshake.query.token, process.env.jwtKey, function(err, decoded) {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        next();
      });
    }
    else {
      next(new Error('Authentication error'));
    }    
  }).on( 'connection', socketMain );
  const socketIoObject = io;
  module.exports.ioObject = socketIoObject;

//Inicio de servidor
http.listen(port, () => {
    console.log(`Corriendo en el puerto: ${port}`);
})