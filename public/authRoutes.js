const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Modelo do usuário no MongoDB

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ erro: 'Usuário não encontrado!' });
        }

        const senhaCorreta = await bcrypt.compare(password, user.password);
        if (!senhaCorreta) {
            return res.status(400).json({ erro: 'Senha incorreta!' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, 'secreto123', { expiresIn: '1h' });

        res.json({ mensagem: 'Login realizado com sucesso!', token });
    } catch (error) {
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

module.exports = router;
