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
const favoritesMD_1 = require("../models/favoritesMD");
const authentication_1 = require("../middlewares/authentication");
const commentMD_1 = require("../models/commentMD");
const postMD_1 = require("../models/poostMD")
const favoriteRoutes = express_1.Router();

//muestra los favoritos del usuario
favoriteRoutes.get('/', authentication_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    body.usuario;
    const id = req.usuario._id;

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const favorite = yield favoritesMD_1.FavoritePost.find({user: req.usuario._id}).skip(skip).limit(10).exec();
    res.json({
        ok: true,
        pagina,
        favorite
    })
}));

//La publicacion que seleciono el usuario se pone en favoritas
favoriteRoutes.post('/post', authentication_1.verificaToken, (req, res) => {
    const body = req.body;
    body.idpost = body._id;
    body._id = null;
    body.user = req.usuario._id;
    const idUser = body.user
    const postId = body.idpost

favoritesMD_1.FavoritePost.findOne({idpost: postId, user: idUser}, (err, favoriteDB) => {
    if (err) {
        throw err;
    }
    if (favoriteDB) {
        return res.json({
            ok: false,
            mensaje: 'La publicacion ya se encuentra'
        });
    }

    if (!favoriteDB) {
        favoritesMD_1.FavoritePost.create(body).then(favoriteDB => {
            res.json({
                ok: true,
                favorite: favoriteDB
            });
        }).catch(err => {
            res.json(err);
        });

    }
});
});

//obtiene los comentarios a traves del id del post y los muestra en la seccion de favoritos del usuario
favoriteRoutes.get('/comments/:idpost', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idpost } = req.params;
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const comment = yield commentMD_1.Comment.find({ post: idpost }).sort({ _id: 1 }).skip(skip).limit(10).exec();
    res.json({
        ok: true,
        pagina,
        comment
    }).catch(err => {
        res.json(err)
    })
}));
//crea un nuevo comentario en la publicacion que se encuentra en favoritos.
favoriteRoutes.post('/comment/:idpost', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idpost } = req.params;
    const post = yield postMD_1.Post.findById(idpost);

    if (post) {
        const newComment = new commentMD_1.Comment(req.body);
        newComment.post = idpost;
        yield commentMD_1.Comment.create(newComment);
        res.json({
            ok: true,
            newComment
        });
    } else {
        throw err;
    }
}));

favoriteRoutes.delete('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;

    yield favoritesMD_1.FavoritePost.findByIdAndDelete(id).then(favoriteDB => {
        res.json({
            ok: true,
            favorite: favoriteDB,
            mensaje: 'Se elimino con exito'
        });
    });
}));

exports.default = favoriteRoutes;
