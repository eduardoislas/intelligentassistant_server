import { Router, Request, Response } from "express";

import { Post } from '../models/poostMD';

import { Comment } from '../models/commentMD'

import { verificaToken } from "../middlewares/authentication";

import Token from '../classes/token'

const postRoutes = Router();

//Mostrar Poost
postRoutes.get('/', async (req: any, res: Response) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;

    const post = await Post.find().sort({ _id: -1 }).skip(skip).limit(10).populate('usuario', '-password').exec();
    res.json({
        ok: true,
        pagina,
        post
    })
});

postRoutes.get('/comments/:id', async (req: any, res: Response) => {

    const { id } = req.params;
    const comment = await Comment.find({ post: id });

    res.json({
        ok: true,
        comment
    })
})

//Creacion de Publicaciones
postRoutes.post('/posts', verificaToken, (req: any, res: Response) => {

    const body = req.body;
    body.usuario = req.usuario._id;

    Post.create(body).then(async postDB => {

        await postDB.populate('usuario', '-password').execPopulate();

        res.json({
            ok: true,
            post: postDB
        })
    }).catch(err => {
        res.json(err)
    });
});



postRoutes.post('/comment/:id', async (req: any, res: Response) => {

    const { id } = req.params
    const post = await Post.findById(id);
    if (post) {
        const newComment = new Comment(req.body);
        newComment.post = id;
        await Comment.create(newComment);

        res.json({
            ok: true,
            newComment
        })
    }

});


postRoutes.delete('/delete/:id', async (req: any, res: Response) => {

    const { id } = req.params;

    await Post.findByIdAndDelete(id);

});

export default postRoutes;
