"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usuario_1 = __importDefault(require("./routes/usuario"));
const post_1 = __importDefault(require("./routes/poost"));
const favorite_1 = __importDefault(require("./routes/favorite"));
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = require("body-parser");
const cors_1 = require("cors");
//const server = new server_1.default();


const express = require('express')
const app = express()


//const http = require('http')
let server =require('http').createServer(app)
const io= require('socket.io')(server);
const port= process.env.PORT || 3000; 


//Configurar CORS
app.use(cors_1({ origin: true, credentials: true }));

//Body Parser

app.use(body_parser_1.urlencoded({extended: true}))
app.use(body_parser_1.json());
//server.app.use(body_parser_1.default.urlencoded({ extended: true }));
//server.app.use(body_parser_1.default.json());

//Rutas de la ap
app.use('/user', usuario_1.default);
app.use('/post', post_1.default);
app.use('/favorite', favorite_1.default);

//Conectando DB
mongoose_1.default.connect('mongodb://localhost:27017/asistenteDB', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        throw err;
    }
    else {
        console.log('base de datos conectada');
    }
});

//IO = esta la comunicacion

//let io = socketio(server);

io.on('connection', (client) => {
    console.log(client)

    client.on('disconnect', function () {
        io.emit('users-changed', { user: client.username, event: 'left' });
    });

    client.on('set-name', (name) => {
        client.username = name;
        io.emit('users-changed', { user: name, event: 'joined' });
    });

    client.on('send-message', (message) => {
        io.emit('message', { msg: message.text, user: client.username, createdAt: new Date() });
    });
});



//Levantando Express
server.listen(port,(err) => {
    //console.log(`Puerto ${server.port}`);
    console.log('listening in http://localhost:'+ port);
    
});
