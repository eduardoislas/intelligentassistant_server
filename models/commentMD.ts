import {Schema, model, Document} from 'mongoose'

const commentSchema = new Schema({
    post:{type: Schema.Types.ObjectId, ref:'Post'},
    description:{type: String},
    date:{type: Date, default: Date.now}
});

commentSchema.pre<IComment>('save', function(next){
    this.date = new Date();
    next();
});


interface IComment extends Document{
    date: Date;
    post: String;
    description: String;

}

export const Comment = model<IComment>('Comment', commentSchema);