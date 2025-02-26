const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/dashboard', authMiddleware, (req, res) => {
    res.json({ mensagem: 'Bem-vindo ao painel!', usuario: req.user });
});

module.exports = router;
