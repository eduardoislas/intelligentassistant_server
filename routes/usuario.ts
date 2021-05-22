import {Router, Request, Response} from "express"
import {Usuario} from '../models/usuarioMD'
import bcrypt from 'bcrypt'
import Token from '../classes/token'
import { verificaToken } from "../middlewares/authentication";

const userRoutes = Router();

userRoutes.post('/create', (req: Request, res: Response)=>{

    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    }
        Usuario.create(user).then(userDB =>{

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email
        });

        res.json({
            ok:true,
            token: tokenUser
        });
    }).catch(err =>{
        res.json({
            ok:false,
            err
        })
    });
});

    
userRoutes.post('/login', (req: Request, res: Response)=>{
    const body = req.body;

    Usuario.findOne({email: body.email}, (err:any, userDB: any)=>{
        if(err){
            throw err;
        }
        if(!userDB){
            return res.json({
                ok: false,
                mensaje: 'Usuario/contrasenia no son validas'
            })
        }

        if(userDB.compararPassword(body.password)){

            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email
            });

            res.json({
                ok:true,
                token: tokenUser
            });
        }
        else{
            return res.json({
                ok: false,
                mensaje: 'Usuario/contrasenia no son validas ***'
            })
        }

    })
});

userRoutes.post('/update', verificaToken, (req: any, res: Response)=>{

    const user={
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email

    }

    Usuario.findByIdAndUpdate(req.usuario._id, user, {new: true} ,(err,userDB)=>{
        if(err){
            throw err;
        }
        if(!userDB){
            return res.json({
                ok:false,
                mensaje: 'No existe el usuario'
            })
        }

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email
        });

        res.json({
            ok:true,
            token: tokenUser
        });
    });
});

userRoutes.get('/', verificaToken, (req: any, res: Response)=>{

    const usuario = req.usuario;

    res.json({
        ok: true,
        usuario
    });
});


userRoutes.get('/todos', async (req: any, res: Response)=>{

   const usuario = await Usuario.find();

    res.json({
        ok: true,
        usuario
    });
});


export default userRoutes;