const express = require('express');
const router = express.Router();

// Lista de anúncios em destaque (em memória para simplificar)
let featuredAds = [
  {
    id: '1001',
    title: 'Honda Civic EXL 2020',
    price: 'R$ 129.900',
    description: 'Sedan compacto, motor 2.0, automático, completo',
    brand: 'Honda',
    model: 'Civic',
    year: '2020',
    km: '45.000',
    location: 'São Paulo, SP',
    paymentDate: '2023-05-10',
    expiryDate: '2023-06-10',
    contact: {
      name: 'Carlos Silva',
      email: 'carlos@exemplo.com',
      phone: '(11) 98765-4321'
    }
  },
  {
    id: '1002',
    title: 'Toyota Corolla Altis 2022',
    price: 'R$ 175.000',
    description: 'Modelo Híbrido, extremamente econômico, único dono',
    brand: 'Toyota',
    model: 'Corolla',
    year: '2022',
    km: '22.000',
    location: 'Rio de Janeiro, RJ',
    paymentDate: '2023-05-15',
    expiryDate: '2023-06-15',
    contact: {
      name: 'Mariana Costa',
      email: 'mariana@exemplo.com',
      phone: '(21) 98765-4321'
    }
  },
  {
    id: '1003',
    title: 'Jeep Compass Limited 2021',
    price: 'R$ 189.900',
    description: 'SUV completo, motor turbo diesel, teto solar panorâmico',
    brand: 'Jeep',
    model: 'Compass',
    year: '2021',
    km: '38.500',
    location: 'Belo Horizonte, MG',
    paymentDate: '2023-05-18',
    expiryDate: '2023-06-18',
    contact: {
      name: 'Pedro Oliveira',
      email: 'pedro@exemplo.com',
      phone: '(31) 98765-4321'
    }
  }
];

// Obter todos os anúncios em destaque
router.get('/', (req, res) => {
  // Filtra apenas anúncios cujo período de destaque não expirou
  const currentDate = new Date();
  const activeAds = featuredAds.filter(ad => {
    const expiryDate = new Date(ad.expiryDate);
    return expiryDate >= currentDate;
  });
  
  res.json(activeAds);
});

// Obter anúncio em destaque por ID
router.get('/:id', (req, res) => {
  const ad = featuredAds.find(ad => ad.id === req.params.id);
  
  if (!ad) {
    return res.status(404).json({ message: 'Anúncio em destaque não encontrado' });
  }
  
  res.json(ad);
});

// Criar um novo anúncio em destaque
router.post('/', (req, res) => {
  const { 
    title, 
    price, 
    description, 
    brand, 
    model, 
    year, 
    km, 
    location, 
    contact 
  } = req.body;
  
  // Validação básica
  if (!title || !brand || !model || !year || !contact) {
    return res.status(400).json({ message: 'Informações incompletas' });
  }
  
  // Gera ID único
  const id = Date.now().toString();
  
  // Define datas de pagamento e expiração
  const paymentDate = new Date().toISOString().split('T')[0];
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30); // Destaque válido por 30 dias
  
  const newAd = {
    id,
    title,
    price,
    description,
    brand,
    model,
    year,
    km,
    location,
    paymentDate,
    expiryDate: expiryDate.toISOString().split('T')[0],
    contact
  };
  
  featuredAds.push(newAd);
  
  res.status(201).json(newAd);
});

// Simular processamento de pagamento
router.post('/payment', (req, res) => {
  const { 
    adId, 
    paymentMethod, 
    amount 
  } = req.body;
  
  // Validação básica
  if (!adId || !paymentMethod) {
    return res.status(400).json({ message: 'Informações de pagamento incompletas' });
  }
  
  // Validar valor
  if (amount !== 15) {
    return res.status(400).json({ message: 'Valor incorreto para destaque de anúncio' });
  }
  
  // Simulação de processamento de pagamento
  const paymentSuccess = Math.random() > 0.1; // 90% de chance de sucesso
  
  if (!paymentSuccess) {
    return res.status(400).json({ message: 'Falha no processamento do pagamento', success: false });
  }
  
  res.json({ 
    message: 'Pagamento processado com sucesso', 
    transactionId: `TRANS-${Date.now()}`,
    success: true
  });
});

module.exports = router; 