const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Registro de usuário
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    // Cria novo usuário
    const user = new User({
      name,
      email,
      password,
      phone
    });

    await user.save();

    // Gera token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário.' });
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca usuário
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    // Verifica senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    // Gera token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login.' });
  }
});

// Logout de usuário
router.post('/logout', auth, async (req, res) => {
  try {
    // Em uma implementação mais robusta, você poderia invalidar o token aqui
    res.json({ message: 'Logout realizado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer logout.' });
  }
});

// Obter perfil do usuário
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar perfil.' });
  }
});

module.exports = router; 