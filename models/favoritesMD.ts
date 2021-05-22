import {Schema, model, Document, Types} from 'mongoose'

const favSchema = new Schema<IFavorite>({
    title: {type: String, required: true},
    description:{type: String, required: true},
    date: {type: Date, default: Date.now},
    views: {type: Number},
    usuario:{type: Schema.Types.ObjectId, ref:'Usuario'},
    user:{type: String},
    idpost:{type:String}
});

favSchema.pre<IFavorite>('save',function(next){
    this.date = new Date();
    next();
})

interface IFavorite extends Document{
    date: Date;
    title: String;
    description: String;
    usuario: String;
    views: Number;
    user: String;
    idpost: string;
}

export const FavoritePost = model<IFavorite>('FavoritePost', favSchema);