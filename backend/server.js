const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente
dotenv.config();

// DEBUG: Verifica se a chave da API foi carregada corretamente
console.log("Hugging Face API Key Loaded:", process.env.HUGGING_FACE_API_KEY ? "Yes" : "No");

// Cria a aplicação Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/fipe', require('./routes/fipe'));
app.use('/api/ai_analysis', require('./routes/ai_analysis'));
app.use('/api/ai_ranker', require('./routes/ai_ranker'));

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado!' });
});

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 