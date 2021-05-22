"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Usuario {

    constructor(){
        this.personas=[];

    }

    agregarPersona(id,nombre){
        let persona = {id, nombre}
        this.personas.push(persona)
        return this.personas;
    }

    getPersona(id){
        let persona = this.personas.filter(persss=>{
            return persona.id===id
        })[0];

    }

    getPersonasPorSala(){
        //...
    }

    borrarPersona(id){
        this.personas = this.personas.filter(persss=>{
            return persona.id!=id
        });
    }


}
exports.default = Usuario;
