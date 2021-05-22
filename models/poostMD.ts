import {Schema, model, Document} from 'mongoose'


const postSchema = new Schema({
    usuario:{type: Schema.Types.ObjectId, ref:'Usuario', required:[true, 'Debes de tener sesion Iniciada para publicar']},
    title: {type: String, required: true},
    description:{type: String, required: true},
    date: {type: Date, default: Date.now},
    views: {type: Number, default: 0},
    likes:{type: Number, default: 0}
});

postSchema.pre<IPost>('save', function(next){
    this.date = new Date();
    next();
});


interface IPost extends Document{
    date: Date;
    title: String;
    description:String;
    views: Number;
    likes: Number;
    usuario: String;

}

export const Post = model<IPost>('Post', postSchema);
