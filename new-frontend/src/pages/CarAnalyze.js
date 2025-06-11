import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardMedia,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  Speed as SpeedIcon,
  LocationOn as LocationOnIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  DirectionsCar as DirectionsCarIcon
} from '@mui/icons-material';
import { supabase } from '../config/supabaseClient';

// Função para limpar e corrigir os dados do veículo antes de usá-los
const cleanCarData = (carData) => {
  let { nome, ano } = carData;

  // Se o ano for nulo, inválido ou 'null', tenta extrair do nome
  if (!ano || ano === 'null' || isNaN(parseInt(ano, 10))) {
    const yearRegex = /\b(19[89]\d|20\d\d)\b/; // Regex para anos de 1980 a 2099
    const match = nome.match(yearRegex);
    if (match) {
      console.log(`AVISO: Ano original ('${ano}') é inválido. Usando ano extraído do nome: ${match[0]}`);
      ano = parseInt(match[0], 10);
      // Remove o ano e espaços extras do nome para limpar a busca de marca/modelo
      nome = nome.replace(yearRegex, '').replace(/\s\s+/g, ' ').trim();
    }
  }
  
  // Retorna o objeto com os dados potencialmente corrigidos
  return { ...carData, nome, ano: ano ? String(ano) : null };
};

const CarAnalyze = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const carName = location.state?.carName; // Receber o nome do carro via state
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data = null;
        
        // Primeiro tenta buscar pelo ID
        const { data: idData, error: idError } = await supabase
          .from('produtos')
          .select('*')
          .eq('id', id)
          .single();
          
        if (!idError && idData) {
          console.log("Veículo encontrado pelo ID:", idData);
          data = idData;
        } else if (carName) {
          // Se não encontrar pelo ID e tiver o nome, busca pelo nome
          console.log("Tentando buscar pelo nome:", carName);
          
          const { data: nameData, error: nameError } = await supabase
            .from('produtos')
            .select('*')
            .eq('nome', carName)
            .limit(1);
            
          if (!nameError && nameData && nameData.length > 0) {
            console.log("Veículo encontrado pelo nome exato:", nameData[0]);
            data = nameData[0];
          } else {
            // Se não encontrar pelo nome exato, tenta uma busca parcial
            console.log("Tentando busca parcial pelo nome:", carName);
            
            const { data: partialData, error: partialError } = await supabase
              .from('produtos')
              .select('*')
              .ilike('nome', `%${carName}%`)
              .limit(1);
              
            if (!partialError && partialData && partialData.length > 0) {
              console.log("Veículo encontrado por correspondência parcial:", partialData[0]);
              data = partialData[0];
            }
          }
        }
        
        if (data) {
          setCar(data);
          // Limpa os dados do veículo assim que eles são recebidos
          const cleanedData = cleanCarData(data);
          console.log("Dados do veículo após limpeza:", cleanedData);
          
          // Gerar análise completa buscando dados do backend
          await generateRealAnalysis(cleanedData);
        } else {
          throw new Error('Veículo não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do veículo:', error);
        setError(
          error.message === 'Veículo não encontrado'
            ? 'Veículo não encontrado. O veículo pode ter sido removido ou o link está incorreto.'
            : 'Não foi possível carregar os detalhes do veículo. Por favor, tente novamente mais tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id, carName]);

  // Função para buscar valor FIPE real do backend
  const fetchFipeValue = async (carData) => {
    try {
      const nomeParts = carData.nome.split(' ');
      const marca = nomeParts[0];
      // O nome já foi limpo, então o resto é o modelo.
      const modelo = nomeParts.slice(1).join(' ');
      const ano = carData.ano;
      const preco = carData.preco;
      
      console.log(`Frontend: Buscando FIPE para Marca: ${marca}, Modelo: ${modelo}, Ano: ${ano}, Preço: ${preco}`);
      
      const params = new URLSearchParams({ marca, modelo, ano, preco });
      const response = await fetch(`/api/fipe/valor?${params.toString()}`);
      
      if (!response.ok) {
        const errorBody = await response.json();
        console.error('Erro da API FIPE:', errorBody);
        throw new Error('Não foi possível consultar a FIPE');
      }
      
      const data = await response.json();
      console.log('Frontend: Resposta da FIPE recebida:', data);
      return data.valor;
    } catch (err) {
      console.error('Frontend: Erro ao chamar fetchFipeValue:', err);
      return null;
    }
  };

  // Nova função para buscar dados da "IA"
  const fetchAiAnalysis = async (carData) => {
    try {
      const params = new URLSearchParams({ nome: carData.nome, ano: carData.ano });
      const response = await fetch(`/api/ai_analysis?${params.toString()}`);
      if (!response.ok) throw new Error('Falha na análise da IA');
      return await response.json();
    } catch (err) {
      console.error('Erro ao buscar análise da IA:', err);
      // Retorna um objeto padrão em caso de erro para não quebrar a UI
      return {
        specs: { carroceria: 'N/A', motor: 'N/A', potencia: 'N/A', torque: 'N/A', cambio: 'N/A', tracao: 'N/A', portas: 'N/A', comprimento: 'N/A', entreEixos: 'N/A', portaMalas: 'N/A' },
        fuelEfficiency: { cidade: { gasolina: 'N/A', etanol: null }, estrada: { gasolina: 'N/A', etanol: null }, eficiencia: 'N/A' }
      };
    }
  };

  const generateRealAnalysis = async (carData) => {
    // Busca dados da FIPE e da Análise de IA em paralelo para mais eficiência
    const [fipeData, aiData] = await Promise.all([
      fetchFipeValue(carData),
      fetchAiAnalysis(carData)
    ]);
    
    // Processa o valor FIPE
    const fipe = (() => {
      if (!fipeData) {
        return {
          valor: 'N/A',
          razaoPrecoFipe: '0',
          avaliacao: 'Não foi possível consultar o valor FIPE para este veículo.'
        };
      }
      
      let evaluation;
      const preco = carData.preco;
      const valorFipeNum = typeof fipeData === 'number' ? fipeData : Number(String(fipeData).replace(/[^0-9,.-]+/g, '').replace(/\./g, '').replace(',', '.'));

      if (preco < valorFipeNum * 0.9) {
        evaluation = 'Preço abaixo da média de mercado, potencial boa oportunidade.';
      } else if (preco > valorFipeNum * 1.1) {
        evaluation = 'Preço acima da média de mercado, negocie com o vendedor.';
      } else {
        evaluation = 'Preço alinhado com a média de mercado para este modelo.';
      }
      return {
        valor: valorFipeNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        razaoPrecoFipe: ((preco / valorFipeNum) * 100).toFixed(0),
        avaliacao: evaluation
      };
    })();

    // ATENÇÃO: Os dados de "commonIssues", "competitors" e "recommendations" ainda são gerados no frontend.
    // Isso pode ser movido para o backend no futuro para uma centralização completa.
    const ageInYears = new Date().getFullYear() - carData.ano;
    const commonIssues = generateCommonIssues(ageInYears, aiData.specs.carroceria);
    const competitors = generateCompetitors(carData.nome, aiData.specs.carroceria);
    const recommendations = generateRecommendations(ageInYears);

    setAnalysis({
      specs: aiData.specs,
      fuelEfficiency: aiData.fuelEfficiency,
      fipe: fipe,
      commonIssues,
      competitors,
      recommendations
    });
  };

  // Funções que ainda permanecem no frontend (podem ser movidas para o backend no futuro)
  const generateCommonIssues = (ageInYears, vehicleType) => {
    // Problemas genéricos por tipo de veículo
    const commonByType = {
      'Sedan': [
        'Falhas no sistema de arrefecimento',
        'Desgaste prematuro de embreagem',
        'Problemas nos rolamentos',
        'Infiltração de água pelo para-brisa'
      ],
      'Hatchback': [
        'Tensores da correia dentada',
        'Barulhos na suspensão',
        'Sistema elétrico das travas',
        'Falhas no alternador'
      ],
      'SUV': [
        'Consumo excessivo de óleo',
        'Problemas no sistema 4x4',
        'Desgaste prematuro dos amortecedores',
        'Falhas na central eletrônica',
        'Infiltrações no teto solar'
      ],
      'Picape': [
        'Problemas na bomba de combustível',
        'Falhas no sistema de injeção',
        'Desgaste de buchas da suspensão',
        'Corrosão na carroceria/caçamba',
        'Folgas na direção'
      ]
    };
    
    // Problemas específicos por idade
    const ageIssues = ageInYears <= 5 ? [
      'Recalls pendentes',
      'Falhas em componentes eletrônicos',
      'Problemas de software'
    ] : ageInYears <= 10 ? [
      'Desgaste natural do sistema de suspensão',
      'Necessidade de troca dos kits de embreagem',
      'Sensores com falha',
      'Deterioração de vedações e mangueiras'
    ] : [
      'Desgaste avançado de componentes de motor',
      'Possível necessidade de retífica',
      'Sistema de arrefecimento comprometido',
      'Desgaste da suspensão',
      'Corrosão em pontos críticos'
    ];
    
    // Selecionar alguns problemas aleatórios de cada categoria
    const selectRandom = (arr, count) => {
      const result = [];
      const copyArr = [...arr];
      for (let i = 0; i < count && copyArr.length > 0; i++) {
        const index = Math.floor(Math.random() * copyArr.length);
        result.push(copyArr[index]);
        copyArr.splice(index, 1);
      }
      return result;
    };
    
    const typeIssues = selectRandom(commonByType[vehicleType], 2);
    const ageSpecificIssues = selectRandom(ageIssues, Math.min(2, ageIssues.length));
    
    return [...typeIssues, ...ageSpecificIssues];
  };

  const generateCompetitors = (carName, vehicleType) => {
    const competitorsByType = {
      'Sedan': {
        'Toyota Corolla': 'Referência de mercado em confiabilidade',
        'Honda Civic': 'Destaque em dirigibilidade e acabamento',
        'Volkswagen Jetta': 'Bom desempenho e conforto',
        'Chevrolet Cruze': 'Equilíbrio entre custo-benefício',
        'Nissan Sentra': 'Espaço interno generoso',
        'Hyundai Elantra': 'Design moderno e boa garantia'
      },
      'Hatchback': {
        'Volkswagen Golf': 'Referência em acabamento e dirigibilidade',
        'Ford Focus': 'Bom comportamento dinâmico',
        'Chevrolet Onix': 'Líder de vendas nacional',
        'Hyundai HB20': 'Design atrativo e boa garantia',
        'Fiat Argo': 'Bom custo-benefício',
        'Renault Sandero': 'Espaço interno e robustez'
      },
      'SUV': {
        'Jeep Compass': 'Conforto e capacidade off-road',
        'Volkswagen T-Cross': 'Boa dirigibilidade e tecnologia',
        'Honda HR-V': 'Espaço interno e confiabilidade',
        'Hyundai Creta': 'Bom custo-benefício',
        'Chevrolet Equinox': 'Performance e tecnologia',
        'Toyota RAV4': 'Excelente confiabilidade',
        'Mitsubishi Outlander': 'Robustez e capacidade off-road'
      },
      'Picape': {
        'Toyota Hilux': 'Líder em robustez e confiabilidade',
        'Chevrolet S10': 'Bom desempenho e conforto',
        'Ford Ranger': 'Capacidade off-road e tecnologia',
        'Volkswagen Amarok': 'Dirigibilidade e motor potente',
        'Mitsubishi L200': 'Tradição em resistência',
        'Fiat Toro': 'Conforto de SUV com praticidade de picape',
        'Nissan Frontier': 'Boa capacidade de carga e robustez'
      }
    };
    
    // Evitar mostrar o próprio modelo como concorrente
    const competitors = { ...competitorsByType[vehicleType] };
    Object.keys(competitors).forEach(key => {
      if (carName.includes(key)) {
        delete competitors[key];
      }
    });
    
    // Selecionar 3 concorrentes aleatórios
    const selectedCompetitors = {};
    const keys = Object.keys(competitors);
    const numToSelect = Math.min(3, keys.length);
    
    for (let i = 0; i < numToSelect; i++) {
      const randomIndex = Math.floor(Math.random() * keys.length);
      const key = keys[randomIndex];
      selectedCompetitors[key] = competitors[key];
      keys.splice(randomIndex, 1);
    }
    
    return selectedCompetitors;
  };

  const generateRecommendations = (ageInYears) => {
    const ageRecommendations = ageInYears <= 3 ? [
      'Verifique se há recalls pendentes para este modelo',
      'Confira se a garantia de fábrica ainda está vigente',
      'Solicite os registros de manutenção preventiva'
    ] : ageInYears <= 8 ? [
      'Realize uma inspeção detalhada da suspensão e freios',
      'Verifique o estado da correia dentada e tensores',
      'Avalie o sistema de arrefecimento',
      'Teste todos os componentes eletrônicos'
    ] : [
      'Realize uma inspeção mecânica completa por especialista',
      'Verifique sinais de retífica ou reparos estruturais',
      'Avalie o estado dos componentes de desgaste (embreagem, amortecedores)',
      'Confira o estado da parte elétrica e eletrônica',
      'Verifique pontos de oxidação ou corrosão'
    ];
    
    const generalRecommendations = [
      'Solicite um test-drive em diferentes condições de rodagem',
      'Consulte a situação do veículo no Detran (multas, IPVA, licenciamento)',
      'Verifique o histórico do veículo (acidentes, inundações)',
      'Compare o valor pedido com a tabela FIPE atual',
      'Avalie o custo das revisões e peças de reposição para este modelo'
    ];
    
    return [...ageRecommendations, ...generalRecommendations];
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleViewDetails = () => {
    // Passar também o nome do carro no state
    navigate(`/cars/${id}`, { state: { carName: carName || (car && car.nome) } });
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mb: 4 }}
        >
          Voltar
        </Button>
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        sx={{ mb: 4 }}
      >
        Voltar
      </Button>

      {car && analysis && (
        <>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Análise Técnica do Veículo
            </Typography>
            <Button 
              variant="outlined" 
              onClick={handleViewDetails}
              startIcon={<DirectionsCarIcon />}
            >
              Ver Detalhes do Veículo
            </Button>
          </Box>

          <Grid container spacing={4}>
            {/* Resumo do veículo */}
            <Grid item xs={12} md={5}>
              <Card elevation={3}>
                <CardMedia
                  component="img"
                  height="250"
                  image={car.imagem || 'https://via.placeholder.com/600x400?text=Sem+Imagem'}
                  alt={car.nome}
                />
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    {car.nome}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {car.ano}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={8}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SpeedIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {car.quilometragem.toLocaleString('pt-BR')} km
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {car.cidade}, {car.estado}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" color="primary" sx={{ mt: 2, mb: 1 }}>
                    R$ {car.preco.toLocaleString('pt-BR')}
                  </Typography>
                </Box>
              </Card>
            </Grid>
            
            {/* Análise Técnica */}
            <Grid item xs={12} md={7}>
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Especificações Técnicas
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Carroceria</Typography>
                    <Typography variant="body1" paragraph>{analysis.specs.carroceria}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Motor</Typography>
                    <Typography variant="body1" paragraph>{analysis.specs.motor}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Potência</Typography>
                    <Typography variant="body1" paragraph>{analysis.specs.potencia}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Torque</Typography>
                    <Typography variant="body1" paragraph>{analysis.specs.torque}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Câmbio</Typography>
                    <Typography variant="body1" paragraph>{analysis.specs.cambio}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Tração</Typography>
                    <Typography variant="body1" paragraph>{analysis.specs.tracao}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Portas</Typography>
                    <Typography variant="body1" paragraph>{analysis.specs.portas}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Comprimento</Typography>
                    <Typography variant="body1" paragraph>{analysis.specs.comprimento}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Entre-eixos</Typography>
                    <Typography variant="body1" paragraph>{analysis.specs.entreEixos}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {analysis.specs.carroceria === 'Picape' ? 'Capacidade de carga' : 'Porta-malas'}
                    </Typography>
                    <Typography variant="body1" paragraph>{analysis.specs.portaMalas}</Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              {/* Valor FIPE */}
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Valor FIPE e Avaliação de Preço
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>Valor FIPE estimado:</Typography>
                  <Typography variant="h6" color="primary">
                    {analysis.fipe.valor}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>Preço anunciado:</Typography>
                  <Typography variant="h6">
                    R$ {car.preco.toLocaleString('pt-BR')} ({analysis.fipe.razaoPrecoFipe}% do valor FIPE)
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" gutterBottom>Avaliação:</Typography>
                  <Typography variant="body1">{analysis.fipe.avaliacao}</Typography>
                </Box>
              </Paper>
              
              {/* Consumo */}
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Consumo Estimado
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>Na cidade:</Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography variant="body1">
                        Gasolina: {analysis.fuelEfficiency.cidade.gasolina} km/l
                      </Typography>
                      {analysis.fuelEfficiency.cidade.etanol && (
                        <Typography variant="body1">
                          Etanol: {analysis.fuelEfficiency.cidade.etanol} km/l
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>Na estrada:</Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography variant="body1">
                        Gasolina: {analysis.fuelEfficiency.estrada.gasolina} km/l
                      </Typography>
                      {analysis.fuelEfficiency.estrada.etanol && (
                        <Typography variant="body1">
                          Etanol: {analysis.fuelEfficiency.estrada.etanol} km/l
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Eficiência energética: {analysis.fuelEfficiency.eficiencia} (considerando a idade do veículo)
                  </Typography>
                </Box>
              </Paper>
              
              {/* Problemas crônicos */}
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Pontos de Atenção para este Modelo
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  {analysis.commonIssues.map((issue, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <WarningIcon color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={issue} />
                    </ListItem>
                  ))}
                </List>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Nota: Estes pontos são comuns neste modelo, mas não necessariamente estão presentes neste veículo específico.
                  Uma inspeção detalhada é sempre recomendada.
                </Typography>
              </Paper>
              
              {/* Concorrentes */}
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Principais Concorrentes
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  {Object.entries(analysis.competitors).map(([competitor, description], index) => (
                    <ListItem key={index} sx={{ py: 1 }}>
                      <ListItemIcon>
                        <DirectionsCarIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={competitor} 
                        secondary={description}
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
              
              {/* Recomendações */}
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Recomendações e Conclusão
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List sx={{ bgcolor: '#f5f5f5', borderRadius: 1, p: 2 }}>
                  {analysis.recommendations.map((recommendation, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <InfoIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={recommendation} />
                    </ListItem>
                  ))}
                </List>
                
                <Typography variant="body1" sx={{ mt: 3, fontStyle: 'italic' }}>
                  Esta análise é baseada em dados genéricos do modelo e ano do veículo.
                  Para uma avaliação precisa, recomendamos uma inspeção presencial por um
                  profissional qualificado.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default CarAnalyze; 