const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const { auth, isAdmin } = require('../middleware/auth');

// Listar todos os carros
router.get('/', async (req, res) => {
  try {
    const { brand, minPrice, maxPrice, year, status } = req.query;
    const query = {};

    // Aplica filtros
    if (brand) query.brand = brand;
    if (year) query.year = year;
    if (status) query.status = status;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const cars = await Car.find(query)
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar carros.' });
  }
});

// Buscar carro por ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('seller', 'name email phone');

    if (!car) {
      return res.status(404).json({ message: 'Carro não encontrado.' });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar carro.' });
  }
});

// Criar novo carro
router.post('/', auth, async (req, res) => {
  try {
    const car = new Car({
      ...req.body,
      seller: req.user._id
    });

    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar carro.' });
  }
});

// Atualizar carro
router.put('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Carro não encontrado.' });
    }

    // Verifica se o usuário é o vendedor ou admin
    if (car.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    Object.assign(car, req.body);
    await car.save();

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar carro.' });
  }
});

// Deletar carro
router.delete('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Carro não encontrado.' });
    }

    // Verifica se o usuário é o vendedor ou admin
    if (car.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    await car.remove();
    res.json({ message: 'Carro removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar carro.' });
  }
});

// Adicionar/remover carro dos favoritos
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Carro não encontrado.' });
    }

    const user = req.user;
    const favoriteIndex = user.favorites.indexOf(car._id);

    if (favoriteIndex === -1) {
      user.favorites.push(car._id);
    } else {
      user.favorites.splice(favoriteIndex, 1);
    }

    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar favoritos.' });
  }
});

// Listar carros favoritos do usuário
router.get('/user/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar favoritos.' });
  }
});

module.exports = router; 