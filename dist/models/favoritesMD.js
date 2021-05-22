"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritePost = void 0;
const mongoose_1 = require("mongoose");
const favSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    views: { type: Number },
    usuario: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario' },
    user: { type: String },
    idpost: { type: String }
});
favSchema.pre('save', function (next) {
    this.date = new Date();
    next();
});
exports.FavoritePost = mongoose_1.model('FavoritePost', favSchema);
