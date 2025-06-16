const path = require('path');
const express = require('express');
const router = express.Router();

// Middleware para proteger rotas
const verificaAutenticacao = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Se não estiver logado, redireciona para o login
    }
    next();
};

// Rota protegida da Home
router.get('/home', verificaAutenticacao, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

router.get('/player', verificaAutenticacao ,(req, res) =>{
    res.sendFile(path.join(__dirname, 'public', '/player.html'))
});

module.exports = router;
