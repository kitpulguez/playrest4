const express = require('express');
const Juego = require('../models/juego');

const multer = require("multer");
const autenticacion = require('../utils/auth');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
});

let upload = multer({storage: storage});

let router = express.Router();

router.get("/juegos", autenticacion, (req, res) => {
    Juego.find().then(resultado => {
        res.render("admin_juegos", {juegos: resultado});
    }).catch(error => {
        res.render("admin_error");
    });
});

router.get("/juegos/nuevo", autenticacion, (req, res) => {
    res.render("admin_juegos_form");
});

router.get("/juegos/editar/:id", autenticacion, (req, res) => {
    Juego.findById(req.params.id).then(resultado => {
        if(resultado)
            res.render("admin_juegos_form", {juego: resultado});
    }).catch (error => {
        res.render("admin_error", {error: "Juego no encontrado"});
    }); 
});

router.post('/juegos', upload.single('imagen') ,(req, res) => {
    let nuevoJuego = new Juego({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        edad: req.body.edad,
        jugadores: req.body.jugadores,
        tipo: req.body.tipo,
        precio: req.body.precio,
        imagen: req.file.filename,
        // Ediciones: [req.body.ediciones]
    });
    
    nuevoJuego.save().then(resultado => {
        res.redirect(req.baseUrl + "/juegos");
    }).catch(error => {
        res.render("admin_error", {error: "Error añadiendo juego"});
    });
});

router.put('/juegos/:id', upload.single('imagen'), (req, res) => {
    Juego.findByIdAndUpdate(req.params.id, {
        $set: {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        edad: req.body.edad,
        jugadores: req.body.jugadores,
        tipo: req.body.tipo,
        precio: req.body.precio,
        // imagen: req.file.filename
        // Ediciones: [ediciones]
        }
    }, {new: true}).then(resultado => {
        if (resultado)
            res.redirect(req.baseUrl + "/juegos");
        else
            res.render("admin_error", {error: "No se ha encontrado el juego"});
    }).catch(error => {
        res.render("admin_error", {error: "Error editando juego"});
    });
});

router.delete('/juegos/:id', (req, res) => {
    Juego.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl + "/juegos");
    }).catch(error => {
        res.render('admin_error', {error: "Error borrando juego"});
    });
});

module.exports = router;