const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization'); // Pega o token do cabeçalho da requisição

    if (!token) {
        return res.status(401).json({ erro: 'Acesso negado! Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, 'secreto123'); // Verifica se o token é válido
        req.user = decoded; // Adiciona os dados do usuário decodificados à requisição
        next(); // Passa para a próxima função/middleware
    } catch (err) {
        res.status(401).json({ erro: 'Token inválido!' });
    }
};
