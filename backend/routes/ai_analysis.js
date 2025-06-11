const express = require('express');
const axios = require('axios'); 
const router = express.Router();


const generateMockAnalysisFallback = (nome, ano) => {
  console.warn(`AVISO: Usando dados simulados como fallback para ${nome} (${ano})`);
  const ageInYears = new Date().getFullYear() - parseInt(ano, 10);
  const nameLower = nome.toLowerCase();
  
  let vehicleType = 'Sedan';
  if (nameLower.includes('suv') || nameLower.includes('crossover') || nameLower.includes('jeep')) vehicleType = 'SUV';
  else if (nameLower.includes('hatch') || nameLower.includes('gol') || nameLower.includes('onix')) vehicleType = 'Hatchback';
  else if (nameLower.includes('picape') || nameLower.includes('pickup') || nameLower.includes('hilux')) vehicleType = 'Picape';

  const baseData = {
      'Sedan': { motor: ['1.0', '1.6', '2.0'], potencia: [75, 120, 170], torque: [10, 16, 21], cambio: ['Manual 5m', 'Auto 6m', 'CVT'], tracao: ['Dianteira'], combustivel: ['Flex', 'Gasolina'], portas: [4], comprimento: [4400, 4700], entreEixos: [2550, 2650], portaMalas: [480, 520] },
      'Hatchback': { motor: ['1.0', '1.4', '1.6'], potencia: [75, 95, 120], torque: [9.5, 13, 16], cambio: ['Manual 5m', 'Auto 6m'], tracao: ['Dianteira'], combustivel: ['Flex'], portas: [4], comprimento: [3900, 4100], entreEixos: [2450, 2550], portaMalas: [280, 350] },
      'SUV': { motor: ['1.6', '2.0', '2.5'], potencia: [120, 170, 200], torque: [16, 21, 25], cambio: ['Auto 6m', 'CVT', 'Auto 9m'], tracao: ['Dianteira', '4x4'], combustivel: ['Flex', 'Gasolina', 'Diesel'], portas: [4], comprimento: [4300, 4600], entreEixos: [2600, 2730], portaMalas: [420, 580] },
      'Picape': { motor: ['2.0', '2.5', '3.0'], potencia: [140, 180, 230], torque: [18, 24, 35], cambio: ['Manual 6m', 'Auto 6m'], tracao: ['4x4'], combustivel: ['Diesel', 'Flex'], portas: [2, 4], comprimento: [5100, 5400], entreEixos: [2950, 3100], capacidadeCarga: [750, 1100] }
  };
  const data = baseData[vehicleType];
  const index = Math.floor(Math.random() * data.motor.length);
  let combustivelFinal = data.combustivel[Math.floor(Math.random() * data.combustivel.length)];
  if ((vehicleType === 'Picape' || vehicleType === 'SUV') && nameLower.includes('diesel')) {
      combustivelFinal = 'Diesel';
  }

  const specs = {
      carroceria: vehicleType,
      motor: `${data.motor[index]} ${nameLower.includes('turbo') ? 'Turbo' : ''} ${combustivelFinal}`,
      potencia: `${data.potencia[index]} cv`,
      torque: `${data.torque[index]} kgfm`,
      cambio: data.cambio[Math.floor(Math.random() * data.cambio.length)],
      tracao: data.tracao[Math.floor(Math.random() * data.tracao.length)],
      combustivel: combustivelFinal,
      portas: data.portas[Math.floor(Math.random() * data.portas.length)],
      comprimento: `${data.comprimento[Math.floor(Math.random() * data.comprimento.length)]} mm`,
      entreEixos: `${data.entreEixos[Math.floor(Math.random() * data.entreEixos.length)]} mm`,
      portaMalas: vehicleType !== 'Picape' ? `${data.portaMalas[Math.floor(Math.random() * data.portaMalas.length)]} litros` : `${data.capacidadeCarga[Math.floor(Math.random() * data.capacidadeCarga.length)]} kg`
  };

  let baseCity, baseHighway;
  if (specs.combustivel === 'Diesel') { baseCity = 8.5; baseHighway = 11.0; }
  else if (specs.combustivel === 'Flex') { baseCity = 7.0; baseHighway = 9.0; }
  else { baseCity = 9.0; baseHighway = 12.0; }
  const typeMultiplier = { 'Sedan': 1.0, 'Hatchback': 1.1, 'SUV': 0.85, 'Picape': 0.7 };
  const engineMultiplier = specs.motor.includes('1.0') ? 1.2 : specs.motor.includes('1.4') ? 1.1 : 1.0;
  const cityEfficiency = (baseCity * typeMultiplier[specs.carroceria] * engineMultiplier).toFixed(1);
  const highwayEfficiency = (baseHighway * typeMultiplier[specs.carroceria] * engineMultiplier).toFixed(1);
  const hasFlex = specs.combustivel === 'Flex';

  const fuelEfficiency = {
      cidade: { gasolina: cityEfficiency, etanol: hasFlex ? (cityEfficiency / 1.4).toFixed(1) : null },
      estrada: { gasolina: highwayEfficiency, etanol: hasFlex ? (highwayEfficiency / 1.4).toFixed(1) : null },
      eficiencia: ageInYears <= 5 ? 'Boa' : ageInYears <= 10 ? 'Média' : 'Reduzida'
  };

  return { specs, fuelEfficiency };
};
// ===================================================================================


const parseJsonFromResponse = (text) => {
    try {
        const startIndex = text.indexOf('{');
        const endIndex = text.lastIndexOf('}');
        if (startIndex === -1 || endIndex === -1) throw new Error('JSON object not found');
        return JSON.parse(text.substring(startIndex, endIndex + 1));
    } catch (error) {
        console.error("Falha ao analisar JSON:", error);
        throw new Error("A resposta da IA não estava em um formato JSON válido.");
    }
};

// Rota que chama a IA para gerar a análise do veículo
router.get('/', async (req, res) => {
    const { nome, ano } = req.query;

    if (!nome || !ano) {
        return res.status(400).json({ error: 'Nome e ano do veículo são obrigatórios.' });
    }

    console.log(`Backend (Direct API Call): Gerando análise para ${nome} (${ano})`);
    
    const prompt = `[INST] You are an expert automotive analyst. For the car "${nome}" (${ano}), provide a valid JSON object with technical specs and fuel efficiency. Do not include any text outside the JSON object. [/INST]`;
    
    const apiUrl = `https://api-inference.huggingface.co/models/google/gemma-2b-it`;
    console.log(`Tentando chamada para a URL: ${apiUrl}`);

    try {
        const response = await axios.post(
            apiUrl,
            {
                inputs: prompt,
                parameters: { max_new_tokens: 512, temperature: 0.7, return_full_text: false }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // Timeout de 30 segundos
            }
        );

        const generatedText = response.data[0].generated_text;
        console.log("Raw AI Response:", generatedText);
        const jsonData = parseJsonFromResponse(generatedText);
        res.json(jsonData);

    } catch (error) {
        console.error("----------- FALHA NA IA - USANDO FALLBACK -----------");
        if (error.response) {
            console.error("Status:", error.response.status, "Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error Message:', error.message);
        }
        console.error("----------------------------------------------------");
        
        // Em caso de erro, gera e retorna os dados simulados
        const mockData = generateMockAnalysisFallback(nome, ano);
        res.json(mockData);
    }
});

module.exports = router; 