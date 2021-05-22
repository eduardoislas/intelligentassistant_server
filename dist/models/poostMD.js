"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    usuario: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'Debes de tener sesion Iniciada para publicar'] },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
});
postSchema.pre('save', function (next) {
    this.date = new Date();
    next();
});
exports.Post = mongoose_1.model('Post', postSchema);
