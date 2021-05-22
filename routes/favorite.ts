import {Router, Request, Response} from "express";

import {FavoritePost} from '../models/favoritesMD';

import {Post} from '../models/poostMD'

import {Usuario} from '../models/usuarioMD'

import { verificaToken } from "../middlewares/authentication";

import { Comment } from '../models/commentMD'

import Token from '../classes/token'

const favoriteRoutes = Router();

favoriteRoutes.get('/', verificaToken, async (req: any, res:Response)=>{
    
    const body = req.body
    body.usuario
    const id = req.usuario._id

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;

    const favorite = await FavoritePost.find({user: id}).skip(skip).limit(10).exec()
        res.json({
            ok:true,
            pagina,
            favorite
        })

})

favoriteRoutes.post('/post', verificaToken,(req: any, res: Response)=>{

    const body = req.body;
    body.idpost = body._id;
    body._id = null;
    body.user = req.usuario._id;

        FavoritePost.create(body).then( favoriteDB=>{
        res.json({
            ok: true,
            favorite: favoriteDB
        })
    }).catch(err =>{
        res.json(err)
    })
})


favoriteRoutes.get('/comments/:idpost', async (req: any, res: Response) => {

    
    const {idpost} = req.params
    const comment = await Comment.find({post: idpost});

    res.json({
        ok: true,
        comment
    })
})
export default favoriteRoutes