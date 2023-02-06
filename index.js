const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const nunjucks = require("nunjucks");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const multer = require("multer");

const juegos = require(__dirname + '/routes/juegos');
const publico = require(__dirname + '/routes/publico');
const auth = require(__dirname + '/routes/auth');

mongoose.connect('mongodb://localhost:27017/playrest_v3');

let app = express();
app.use('/public', express.static(__dirname + '/public'));  

app.use(session({
    secret: "1234",
    resave: true,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.set("view engine", "njk");
app.use(express.json());
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.urlencoded());

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use('/admin', juegos);
app.use('/', publico);
app.use("/auth", auth);

nunjucks.configure("views", {
    autoescape: true,
    express: app
});

app.listen(8080);