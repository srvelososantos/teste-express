const express = require('express');
const User = require('./models/user');
const Book = require('./models/book');
const router = express.Router();
//const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

dotenv.config();

// Configuração do Multer (upload de arquivos)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'), //  Define a pasta para salvar os arquivos(por enquanto só da para salvar na pasta uploads)
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer ({ storage });

//  rota para fazer toda a validaçao
router.post('/users', [
  body('nome').notEmpty().withMessage('O nome é obrigatório').isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres'),
  body('email').isEmail().withMessage('E-mail inválido').notEmpty().withMessage('O email é obrigatório'),
  body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
  body('confirmPassword').notEmpty().withMessage('Confirmaçao de senha é obrigatória').custom((value, {req}) => {
    if(value !== req.body.password){
        throw new Error('As senhas nao coincidem');
    }
    if(!temLetrasENumeros(req.body.password)){
        throw new Error('As senhas nao possuem letras e números');
    }
    return true;
  }),
  body('confirmEmail').custom( async (value, {req}) => {
    if(value !== req.body.email){
        throw new Error('Os emails nao coincidem');
    }
    
    const existingUser = await User.findOne({ email: value });
    if (existingUser) {
        throw new Error('Email ja registrado');
    }
    return true;
  }),

], async (req, res) => {

    const errors = validationResult(req);

    const {nome, email, password, confirmEmail} = req.body;
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: errors.array() });
  }
  
  return res.json({ nome, email, password });
});

//rota para inserir no banco
router.post('/register', async (req, res) => {
    const { nome, email, password } = req.body;
    const dt = new Date()
    const newUser = new User({ nome:nome, email:email, password:password, created_at:dt, updated_at:dt });
    console.log(" inserido no banco = " + newUser);
    const senhaHash = await bcrypt.hash(password, 10);
    await newUser.save();
    return res.json({ redirect: '/login' });
});

// Rota para login do usuário
router.post('/login', async (req, res) => {
    
    const { email, pw } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Usuário não encontrado' });
      }
  
      const isMatch = await user.comparePassword(pw);
      if (!isMatch) {
        return res.status(400).json({ message: 'Senha incorreta' });
      }

      req.session.user = { id: user._id.toString(), nome: user.nome, email:user.email };
      console.log(req.session.user)
      //const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        if (!req.session) {
            return res.status(500).json({ message: 'Erro na sessão. Tente novamente.' }); 
        }
        return res.json({ redirect: '/home' });
      
    } catch (err) {
      res.status(500).json({ message: 'Erro ao fazer login', error: err.message });
    }
});

router.get('/getuserData', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    res.json(req.session.user);
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
router.put('/users/updpw', async (req, res) => {
    const { newpassword } = req.body;
    console.log(newpassword)
    try {
        if(session.user){
            const updatedUser = await User.findByIdAndUpdate(session.user.id, { password:newpassword }, { new: true });
            res.json(updatedUser);
        }
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
router.post('/upload', upload.single('pdf'), async (req, res) => {
    const { voice } = req.body;
    const { originalname } = req.file;
    const userId = req.session.user.id;

    try{
    
        // Criando livro no banco de dados
        const newBook = new Book({
            title: originalname.replace('.pdf', ''),
            author: "Desconhecido", // Pode ser extraído do PDF se necessário
            voice,
            status: "processing",
            progress: 0,
            filePath: req.file.path,
            userId: userId
        });
    
        await newBook.save();
        res.status(201).json(({ message: "livro enviado com sucesso", book: newBook }))

    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Erro ao processar o arquivo." });
    }
});

//      SEARCH

router.get('/buscar', async (req, res) => {
    const { termo } = req.query; // Obtém o termo da URL (query string)

    if (!termo) return res.json([]); // Se não houver termo, retorna lista vazia

    try {
        // Busca usuários cujo nome contenha o termo digitado (case insensitive)
        const books = await Book.find({ 
            title: new RegExp(termo, 'i'),
            userId: req.session.user.id 
        }).limit(5); // Limita os resultados para evitar excesso de dados

        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar usuários" });
    }
});

// PLAYER
router.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Livro não encontrado" });

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
  }
});

//  Rota para obter todos os livros
router.get('/books', verificarAutenticacao, async (req, res) => {
    try {
        const books = await Book.find({ userId:req.session.user.id });
        res.json(books);
    } catch (error) {
        console.log(req.user.id);
        res.status(500).json({ message: "Erro ao buscar livros." });
    }
});

function verificarAutenticacao(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Acesso negado. Faça login para continuar.' });
    }
    
    next(); // Se o usuário estiver logado, continua para a próxima função
}

function temLetrasENumeros(str) {
    return /[a-zA-Z]/.test(str) && /\d/.test(str); // Verifica se contém pelo menos uma letra e um número
}

module.exports = router;