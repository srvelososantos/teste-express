const express = require('express');
const User = require('./models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { body, validationResult } = require('express-validator');
const session = require('express-session');
const path = require('path');



dotenv.config();

// Criar um usuário (Create)
/*.post('/users', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já registrado' });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();
        //const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ newUser });
    } catch (err) {
        res.status(400).json({ error: 'Erro ao criar o usuário', message: err.message });
    }
});*/

router.post('/users', [
  body('nome').notEmpty().withMessage('O nome é obrigatório').isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
], async (req, res) => {
    const errors = validationResult(req);

    const {nome, email, password, confirmEmail} = req.body;
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: errors.array() });
  }
  const existingUser = await User.findOne({ email });   
  if (existingUser) {
      return res.status(400).json({ message: 'Email já registrado' });
  }

  if(email != confirmEmail){
    return res.status(400).json({ message: 'Os e-Mails informados são diferentes' })
  }
  //const senhaHash = await bcrypt.hash(password, 10);
  const newUser = new User({ nome, email, password });
  /*done */
  console.log(newUser)
  await newUser.save();
  res.status(201).json({ user: newUser,
    mensagem: 'Cadastro realizado com sucesso!'
   });
  //res.json({ mensagem: 'Cadastro realizado com sucesso!' });  
});

// login
// Rota para login do usuário
router.post('/login', async (req, res) => {
    
    const { email, pw } = req.body;
  
    try {
      const user = await User.findOne({ email });
      console.log(user._id)
      if (!user) {
        return res.status(400).json({ message: 'Usuário não encontrado' });
      }
  
      const isMatch = await user.comparePassword(pw);
      if (!isMatch) {
        return res.status(400).json({ message: 'Senha incorreta' });
      }

      
      req.session.user = { id: user._id.toString(), nome: user.nome };
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      console.log('logado')

        if (!req.session) {
            return res.status(500).json({ message: 'Erro na sessão. Tente novamente.' }); 
        }
        res.redirect('/home');
      
    } catch (err) {
      res.status(500).json({ message: 'Erro ao fazer login', error: err.message });
    }
});

router.get('/session-test', (req, res) => {
    res.json({ session: req.session });
});

// Obter todos os usuários (Read)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao obter usuários', message: err.message });
    }
});

// Atualizar um usuário (Update)
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: 'Erro ao atualizar o usuário', message: err.message });
    }
});

// Deletar um usuário (Delete)
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: 'Erro ao deletar o usuário', message: err.message });
    }
});

// Deletar um usuário (Delete)
router.delete('/users', async (req, res) => {
    //const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: 'Erro ao deletar o usuário', message: err.message });
    }
});

// Rota de logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        return res.redirect('/login'); // Redireciona para o login após o logout
    });
});

//add book
router.post('/')

module.exports = router;