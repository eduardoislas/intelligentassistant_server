"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioMD_1 = require("../models/usuarioMD");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const authentication_1 = require("../middlewares/authentication");
const { json } = require("body-parser");
const userRoutes = express_1.Router();
//google
var CLIENT_ID = require('../config/config').CLIENT_ID
const { OAuth2Client } = require('google-auth-library');
//const { verify } = require("jsonwebtoken");
const client = new OAuth2Client(CLIENT_ID);

//crea un nuevo usuario y genera el token con la informacion del usuario
userRoutes.post('/create', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        fechaNaci: req.body.fechaNaci,
        genero: req.body.genero,
        tiempoCuidado: req.body.tiempoCuidado,
        relacion: req.body.relacion,
        password: bcrypt_1.default.hashSync(req.body.password, 10)

    };
    usuarioMD_1.Usuario.create(user).then(userDB => {
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            fechaNaci: userDB.fechaNaci,
            genero: userDB.genero,
            tiempoCuidado: userDB.tiempoCuidado,
            relacion: userDB.relacion
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});

//Loguea al usario y crea un token con la informacion del usuario logueado
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    usuarioMD_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            throw err;
        }
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contrasenia no son validas'
            });
        }
        if (userDB.compararPassword(body.password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                fechaNaci: userDB.fechaNaci,
                genero: userDB.genero,
                tiempoCuidado: userDB.tiempoCuidado,
                relacion: userDB.relacion
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contrasenia no son validas ***'
            });
        }
    });
});
//Actualiza el usuario y crea el nuevo token con la informacion actualizada
userRoutes.post('/update', authentication_1.verificaToken, (req, res) => {
    
    const user = {
        
        nombre: req.body.nombre || req.usuario.nombre,  
        fechaNaci: req.body.fechaNaci || req.usuario.fechaNaci,
        genero: req.body.genero || req.usuario.genero,
        tiempoCuidado: req.body.tiempoCuidado || req.usuario.tiempoCuidado,
        relacion: req.body.relacion || req.usuario.relacion,
        //  password: bcrypt_1.default.hashSync(req.body.password, 10)
    };
    usuarioMD_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err) {
            throw err;
        }
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe el ususario'
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            // _id: userDB._id,
            // nombre: userDB.nombre,
            // email: userDB.email
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            fechaNaci: userDB.fechaNaci,
            genero: userDB.genero,
            tiempoCuidado: userDB.tiempoCuidado,
            relacion: userDB.relacion
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});

//obtiene todos los ususarios
userRoutes.get('/', authentication_1.verificaToken, (req, res) => {
    const usuario = req.usuario
    res.json({
        ok: true,
        usuario
    })

})

//Aqui son todos los usuarios
//despues sacar todos los usuarios, de una lista de amigos del objeto***
userRoutes.get('/todos', async (req, res) => {

    const usuario= await usuarioMD_1.Usuario.find();
    res.json(await usuarioMD_1.Usuario.find());
});





//===========
//Google
//===========
//client ID, es la id del signin en google for websites
async function verificaTokenGoogle(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];


    return {
        nombre: payload.name,
        email: payload.email,
        //nombre:payload.name,
        google: true

    }
}

userRoutes.post('/googlelogin', async (req, res) => {

    var token = req.body.token
    var googleUser = await verificaTokenGoogle(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: "Token google no valido"

            });
        });





    usuarioMD_1.Usuario.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar al usuario',
                errors: err
            })
        }

        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar su auntenticacion normal',
                    errors: err
                });

            } else {


                const tokenUser = token_1.default.getJwtToken({
                    _id: userDB._id,
                    nombre: userDB.nombre,
                    email: userDB.email
                });


                res.json({
                    ok: true,
                    token: tokenUser,
                    usuario: userDB
                });
            }
        } else {
            //el usuario no existe y se crea
            console.log("usuario no existe y crea")
            // var usuario = new usuarioMD_1.Usuario();
            var usuario = new usuarioMD_1.Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.google = true;
            usuario.password = ":)";

            console.log(usuario);


            usuarioMD_1.Usuario.create(usuario).then(userDB => {
                const tokenUser = token_1.default.getJwtToken({
                    _id: usuario._id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    google: true
                });
                res.json({
                    ok: true,
                    token: tokenUser

                });
            }).catch(err => {
                res.json({
                    ok: false,
                    err
                });
            });



        }

    })




})
exports.default = userRoutes;
