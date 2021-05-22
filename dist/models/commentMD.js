"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    post: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Post' },
    description: { type: String, require:[true, 'Se necesita el comentario para continuar']},
    date: { type: Date, default: Date.now }
});
commentSchema.pre('save', function (next) {
    this.date = new Date();
    next();
});
exports.Comment = mongoose_1.model('Comment', commentSchema);

