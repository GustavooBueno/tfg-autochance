const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  specifications: {
    mileage: {
      type: String,
      required: true
    },
    fuel: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    transmission: {
      type: String,
      required: true
    },
    doors: {
      type: Number,
      required: true
    },
    seats: {
      type: Number,
      required: true
    }
  },
  location: {
    type: String,
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para melhorar a performance das buscas
carSchema.index({ title: 'text', description: 'text' });
carSchema.index({ brand: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ year: 1 });

const Car = mongoose.model('Car', carSchema);

module.exports = Car; 