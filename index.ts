import userRoutes from './routes/usuario';
import postRoutes from './routes/poost';
import favoriteRoutes from './routes/favorite';
import Server from './classes/server';
import mongoose from 'mongoose';
import bodyParser from 'body-parser'
import cors from 'cors'
import   SocketIoModule  from 'ngx-socket-io';




const server = new Server()

//Configurar CORS

server.app.use(cors({origin: true, credentials: true}));


//Body Parser
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

//Rutas de la ap
server.app.use('/user', userRoutes);
server.app.use('/post', postRoutes);
server.app.use('/favorite', favoriteRoutes);




//Conectando DB
mongoose.connect('mongodb://localhost:27017/asistenteDB',
                {useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
                    if(err){
                        throw err;
                    }
                     else{
                         console.log('base de datos conectada');
                    }
                });




//SOCKET



//Levantando Express
server.start(()=>{
    console.log(`Puerto ${server.port}`);
});

