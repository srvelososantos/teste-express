const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const path = require('path');
const bcrypt = require('bcryptjs')

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/api', routes);
app.use(express.static(path.join(__dirname, 'public')));

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

