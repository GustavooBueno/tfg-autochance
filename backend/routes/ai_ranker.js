const express = require('express');
const axios = require('axios');
const router = express.Router();

const HUGGING_FACE_API_URL = `https://api-inference.huggingface.co/models/google/gemma-2b-it`;
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

// Analisa e extrai um objeto JSON da resposta de texto da IA
const parseJsonFromResponse = (text) => {
    try {
        const startIndex = text.indexOf('{');
        const endIndex = text.lastIndexOf('}');
        if (startIndex === -1 || endIndex === -1) throw new Error('Objeto JSON não encontrado na resposta.');
        return JSON.parse(text.substring(startIndex, endIndex + 1));
    } catch (error) {
        console.error("Erro ao analisar JSON da IA:", error);
        return { score: 0, justification: "A análise da IA falhou." };
    }
};

// Chama a IA para analisar um único carro com base nas prioridades do usuário
const analyzeCarWithAI = async (car, priorities) => {
    const prompt = `[INST]Você é um avaliador de carros. Um usuário busca um veículo com as seguintes prioridades: "${priorities.join(', ')}".
    Analise este carro:
    - Nome: ${car.nome}
    - Ano: ${car.ano}
    - Preço: R$ ${car.preco}
    - Km: ${car.quilometragem}

    Forneça um objeto JSON com "score" (um inteiro de 0 a 100) e "justification" (uma string curta, máx. 15 palavras).
    Exemplo: {"score": 85, "justification": "Excelente custo-benefício e ótimo para a cidade."}
    Não inclua nenhum texto fora do objeto JSON.[/INST]`;

    try {
        const response = await axios.post(
            HUGGING_FACE_API_URL,
            {
                inputs: prompt,
                parameters: { max_new_tokens: 100, temperature: 0.5, return_full_text: false }
            },
            {
                headers: {
                    'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 20000 // Timeout de 20s por carro
            }
        );

        const generatedText = response.data[0].generated_text;
        console.log(`Resposta da IA para ${car.nome}:`, generatedText);
        const analysis = parseJsonFromResponse(generatedText);
        
        return { ...car, ...analysis };

    } catch (error) {
        console.error(`Erro ao analisar o carro ${car.id} (${car.nome}) com a IA:`, error.message);
        return { ...car, score: 0, justification: "Não foi possível analisar este carro." };
    }
};

// Rota principal que recebe os carros e os ranqueia
router.post('/', async (req, res) => {
    const { cars, priorities } = req.body;

    if (!cars || !priorities || !Array.isArray(cars) || cars.length === 0) {
        return res.status(400).json({ error: 'A lista de carros e as prioridades são obrigatórias.' });
    }

    console.log(`IA Ranker: Recebidos ${cars.length} carros para ranquear com as prioridades: ${prioridades.join(', ')}`);

    try {
        // Roda a análise para todos os carros em paralelo
        const analysisPromises = cars.map(car => analyzeCarWithAI(car, priorities));
        const rankedCars = await Promise.all(analysisPromises);

        // Ordena pela pontuação (score) recebida da IA
        rankedCars.sort((a, b) => b.score - a.score);

        res.json(rankedCars);

    } catch (error) {
        console.error("Erro no processo de ranqueamento da IA:", error);
        res.status(500).json({ error: 'Falha ao ranquear os veículos com a IA.' });
    }
});

module.exports = router; 