const mongoose = require("mongoose");

let edicionesSchema = new mongoose.Schema({
    nombreEdicion: {
        type: String,
        required: true
    },
    anyo: {
        type: Number,
        min: 2001,
        max: 2022
    }
});

let juegoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    edad: {
        type: Number,
        required: true,
        min: 1,
        max: 99
    },
    jugadores: {
        type: Number,
        required: true
    },
    tipo: {
        type: String,
        enum: ["rol", "escape", "dados", "fichas", "cartas", "tablero"]
    },
    precio: {
        type: Number,
        min: 1,
        required: true
    },
    imagen: {
        type: String
    },
    // Ediciones: [edicionesSchema]
});

let Juego = mongoose.model('juego', juegoSchema);

module.exports = Juego;