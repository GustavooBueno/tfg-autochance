const express = require('express');
const axios = require('axios');
const router = express.Router();

const FIPE_API_BASE_URL = 'https://parallelum.com.br/fipe/api/v1';

// Função auxiliar para normalizar e limpar strings para comparação
const normalize = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9\s]/gi, '')   // Remove caracteres especiais
    .trim();
};

// Função de fallback para gerar um valor FIPE
const generateMockFipeValue = (preco) => {
  if (!preco || isNaN(parseFloat(preco))) {
    console.error('Fallback FIPE falhou: preço do veículo não foi fornecido ou é inválido.');
    // Retorna um objeto que sinaliza o erro
    return { erro: true };
  }
  
  console.warn('AVISO: Usando fallback para gerar valor FIPE simulado.');
  const precoNum = parseFloat(preco);
  const variance = Math.random() * 0.3 - 0.15; // Variação de -15% a +15%
  const fipeRatio = 1 + variance;
  const fipeValue = precoNum * fipeRatio;
  
  // Retorna um valor numérico como string, que o frontend já sabe processar.
  return { valor: fipeValue.toFixed(2) };
};

router.get('/valor', async (req, res) => {
  const { marca, modelo, ano, tipo = 'carros', preco } = req.query;
  console.log('Backend: Nova consulta FIPE para:', { marca, modelo, ano, preco });

  // 1. Validação de Entrada
  if (!marca || !modelo || !ano || ano === 'null' || isNaN(parseInt(ano, 10))) {
    const errorMsg = `Parâmetros inválidos. Marca, modelo e ano são obrigatórios. Ano recebido: ${ano}`;
    console.error(errorMsg);
    return res.status(400).json({ error: errorMsg });
  }

  try {
    // 2. Buscar Marcas de forma flexível
    const marcasResp = await axios.get(`${FIPE_API_BASE_URL}/${tipo}/marcas`);
    const marcaNorm = normalize(marca);
    const marcaObj = marcasResp.data.find(m => normalize(m.nome).includes(marcaNorm));
    
    if (!marcaObj) {
      const errorMsg = `Marca "${marca}" não encontrada na API da FIPE.`;
      console.error(errorMsg);
      throw new Error(errorMsg); // Lança erro para acionar o fallback no bloco catch
    }
    console.log(`Marca encontrada: ${marcaObj.nome} (Código: ${marcaObj.codigo})`);

    // 3. Busca Inteligente de Modelo
    const modelosResp = await axios.get(`${FIPE_API_BASE_URL}/${tipo}/marcas/${marcaObj.codigo}/modelos`);
    const modelos = modelosResp.data.modelos;
    
    const modeloQueryNorm = normalize(modelo);
    let bestMatch = null;
    let maxScore = -1;

    for (const fipeModel of modelos) {
      const fipeModelNorm = normalize(fipeModel.nome);
      let score = 0;

      // Bônus alto se o modelo da FIPE começar com o modelo pesquisado
      if (fipeModelNorm.startsWith(modeloQueryNorm)) {
        score += 100;
      }

      // Pontos por palavras em comum
      const modeloQueryWords = modeloQueryNorm.split(/\s+/).filter(Boolean);
      const fipeModelWords = fipeModelNorm.split(/\s+/).filter(Boolean);
      score += modeloQueryWords.filter(word => fipeModelWords.includes(word)).length;
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = fipeModel;
      }
    }

    if (!bestMatch || maxScore < 1) { // Limiar mínimo de 1 ponto
      const errorMsg = `Modelo "${modelo}" não encontrado para a marca "${marca}".`;
      console.error(errorMsg);
      throw new Error(errorMsg); // Lança erro para acionar o fallback no bloco catch
    }
    const modeloObj = bestMatch;
    console.log(`Melhor correspondência de modelo: ${modeloObj.nome} (Código: ${modeloObj.codigo}) com score ${maxScore}`);

    // 4. Buscar Ano
    const anosResp = await axios.get(`${FIPE_API_BASE_URL}/${tipo}/marcas/${marcaObj.codigo}/modelos/${modeloObj.codigo}/anos`);
    const anoObj = anosResp.data.find(a => a.codigo.startsWith(ano));
    
    if (!anoObj) {
      const errorMsg = `Ano "${ano}" não encontrado para o modelo "${modeloObj.nome}".`;
      console.error(errorMsg);
      throw new Error(errorMsg); // Lança erro para acionar o fallback no bloco catch
    }
    console.log(`Ano encontrado: ${anoObj.nome} (Código: ${anoObj.codigo})`);

    // 5. Buscar Preço Final
    const precoResp = await axios.get(`${FIPE_API_BASE_URL}/${tipo}/marcas/${marcaObj.codigo}/modelos/${modeloObj.codigo}/anos/${anoObj.codigo}`);
    const precoData = precoResp.data;
    console.log('Dados do preço final:', precoData);

    res.json({
      valor: precoData.Valor,
      modelo: precoData.Modelo,
      anoModelo: precoData.AnoModelo,
      codigoFipe: precoData.CodigoFipe,
      combustivel: precoData.Combustivel
    });

  } catch (err) {
    const errorMsg = err.response ? err.response.data : err.message;
    console.error('Erro detalhado ao consultar FIPE API:', errorMsg);
    
    // Inicia o processo de fallback
    const mockData = generateMockFipeValue(preco);

    // Se o fallback também falhar (por falta de preço), retorna um erro claro.
    if (mockData.erro) {
      return res.status(400).json({ 
        error: 'A consulta à FIPE falhou e o fallback não pôde ser executado por falta do parâmetro "preco".' 
      });
    }

    // Se o fallback funcionar, retorna os dados simulados com sucesso.
    res.json(mockData);
  }
});

module.exports = router;
