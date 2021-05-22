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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postMD_1 = require("../models/poostMD");
const commentMD_1 = require("../models/commentMD");
const authentication_1 = require("../middlewares/authentication");
const postRoutes = express_1.Router();
//Mostrar Poost
postRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const post = yield postMD_1.Post.find().sort({ _id: -1 }).skip(skip).limit(10).populate('usuario', '-password').exec();
    res.json({
        ok: true,
        pagina,
        post
    });
}));
//obtiene los comentarios a traves del id de la publicacion
postRoutes.get('/comments/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const comment = yield commentMD_1.Comment.find({ post: id }).sort({ _id: 1 }).exec();
    res.json({
        ok: true,
        pagina,
        comment
    });
}));

//Creacion de Publicaciones
postRoutes.post('/posts', authentication_1.verificaToken, (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    postMD_1.Post.create(body).then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield postDB.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            post: postDB
        });
    })).catch(err => {
        res.json(err);
    });
});
//crea el Comentario
postRoutes.post('/comment/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield postMD_1.Post.findById(id);

    if (post) {
        const newComment = new commentMD_1.Comment(req.body);
        newComment.post = id;
        yield commentMD_1.Comment.create(newComment).then(postDB => {
            res.json({
                ok: true,
                newComment
            });
        }).catch(err => {
            res.json(err);
        });
    } else {
        res.json({
            ok: false,
            mensaje: 'La publicacion no existe'
        })
    }
}));
//elimina la publicacion
postRoutes.delete('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield postMD_1.Post.findByIdAndDelete(id).then(postDB => {
        res.json({
            ok: true,
            post: postDB,
            mensaje: 'Publicacion Eliminada'
        });
    });
}));
exports.default = postRoutes;
