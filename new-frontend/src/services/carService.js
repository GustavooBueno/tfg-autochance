import axios from 'axios';

const API_URL = 'http://localhost:5000/api/cars';

// Obter todos os carros com filtros
const getCars = async (filters) => {
  try {
    const response = await axios.get(API_URL, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter carros:', error);
    throw error;
  }
};

const carService = {
  getCars,
  // outras funções...
};

export default carService; 