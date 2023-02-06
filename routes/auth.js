const express = require('express');
const Usuario = require('../models/usuario');

let router = express.Router();

let usuarios = [];

router.get("/login", (req, res) => {
    res.render("auth_login");
});

router.post('/login', (req, res) => {
    let login = req.body.login;
    let password = req.body.password;

    Usuario.find().then(resultado => {
        usuarios = resultado;

        let existeUsuario = usuarios.filter(usuario => usuario.login == login && usuario.password == password);

        if (existeUsuario.length > 0)
        {
            req.session.login = existeUsuario[0].login;
            res.render('admin_juegos');
        } else {
            res.render('auth_login',{error: "Usuario o contraseña incorrectos"});
        }
    });    
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.render("publico_index");
});

module.exports = router;