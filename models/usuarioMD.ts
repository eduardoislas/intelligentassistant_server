import {Schema, model, Document} from 'mongoose'
import bcrypt from 'bcrypt'

const usarioSchema = new Schema<IUsuario>({
    nombre:{type: String, required: [true, 'Nombre necesario']},
    email:{type: String, required: [true, 'Email necesario']},
    password:{type: String, required: [true, 'Contrasenia necesaria']}

});

interface IUsuario extends Document{
    nombre: string,
    email: string,
    password: string
    
    compararPassword(password: string): boolean
}

usarioSchema.method('compararPassword', function( password: string = ''): boolean{
    if(bcrypt.compareSync(password, this.password)){
        return true;
    }else{
        return false;
    }
});

export const Usuario = model<IUsuario>('Usuario', usarioSchema);
