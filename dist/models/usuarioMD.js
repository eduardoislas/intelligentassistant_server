"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const usarioSchema = new mongoose_1.Schema({
    nombre: { type: String, required: [true, 'Nombre necesario'] },
    email: { type: String, required: [true, 'Email necesario'] },
    password: { type: String, required: [true, 'Contrasenia necesaria'] },
    google:{type: Boolean, default: false},
    genero:{type:String,},
    fechaNaci:{type:String},
    tiempoCuidado:{type:String},
    relacion:{type:String}
});
usarioSchema.method('compararPassword', function (password = '') {
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
exports.Usuario = mongoose_1.model('Usuario', usarioSchema);
