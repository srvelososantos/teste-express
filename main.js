const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./routes');
const path = require('path');

const protectedRoutes = require('./protectedRoutes'); // Rotas protegidas
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware de sessão
app.use(session({
    secret: '#&*¨&¨%$*%(¨&)&*(GDJFKGHUIYT&¨%tfgyfgg', // Use uma chave forte e segura
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // true se estiver rodando com HTTPS
}));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/api', routes);
app.use('/', protectedRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/crudDB', {
    
}).then(() => {
    console.log('Conectado ao MongoDB');
}).catch(err => {
    console.log('Erro ao conectar ao MongoDB:', err);
});


app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public', '/index.html'))
});

app.get('/login', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public', '/login.html'))
});

app.get('/register', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public', '/register.html'))
});

app.listen(port, () =>{
    console.log('server is running in localhost:3000')
});

module.exports = app;