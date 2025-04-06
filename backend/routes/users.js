const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// Listar todos os usuários (apenas admin)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
});

// Buscar usuário por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se o usuário está buscando seu próprio perfil ou é admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário.' });
  }
});

// Atualizar usuário
router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se o usuário está atualizando seu próprio perfil ou é admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Remove campos que não devem ser atualizados
    delete req.body.password;
    delete req.body.role;

    Object.assign(user, req.body);
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário.' });
  }
});

// Deletar usuário
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    await user.remove();
    res.json({ message: 'Usuário removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário.' });
  }
});

// Alterar senha
router.put('/:id/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se o usuário está alterando sua própria senha
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Verifica senha atual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha atual incorreta.' });
    }

    // Atualiza senha
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Senha alterada com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao alterar senha.' });
  }
});

// Listar carros do usuário
router.get('/:id/cars', async (req, res) => {
  try {
    const cars = await Car.find({ seller: req.params.id })
      .populate('seller', 'name email phone');
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar carros do usuário.' });
  }
});

module.exports = router; 