import axios from 'axios';

const API_URL = 'http://localhost:5000/api/featured';

// Obter todos os anúncios em destaque
const getFeaturedAds = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter anúncios em destaque:', error);
    throw error;
  }
};

// Obter um anúncio em destaque por ID
const getFeaturedAdById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao obter anúncio em destaque com ID ${id}:`, error);
    throw error;
  }
};

// Criar um novo anúncio em destaque
const createFeaturedAd = async (adData) => {
  try {
    const response = await axios.post(API_URL, adData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar anúncio em destaque:', error);
    throw error;
  }
};

// Processar pagamento para destaque de anúncio
const processPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/payment`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    throw error;
  }
};

const featuredService = {
  getFeaturedAds,
  getFeaturedAdById,
  createFeaturedAd,
  processPayment
};

export default featuredService; 