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
          // Gerar análise detalhada baseada nos dados encontrados
          generateMockAnalysis(data);
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

  // Função para gerar análise detalhada baseada nos dados do carro
  const generateMockAnalysis = (carData) => {
    const ageInYears = new Date().getFullYear() - carData.ano;
    
    // Determinar o tipo de veículo baseado no nome
    let vehicleType = 'Sedan';
    const nameLower = carData.nome.toLowerCase();
    
    if (nameLower.includes('suv') || 
        nameLower.includes('crossover') || 
        nameLower.includes('jeep') || 
        nameLower.includes('compass') || 
        nameLower.includes('renegade')) {
      vehicleType = 'SUV';
    } else if (nameLower.includes('hatch') || 
               nameLower.includes('gol') || 
               nameLower.includes('onix') || 
               nameLower.includes('polo')) {
      vehicleType = 'Hatchback';
    } else if (nameLower.includes('picape') || 
               nameLower.includes('pickup') || 
               nameLower.includes('hilux') || 
               nameLower.includes('ranger') || 
               nameLower.includes('toro')) {
      vehicleType = 'Picape';
    }
    
    // Gerar especificações técnicas fictícias baseadas no tipo e nome do veículo
    const generateTechnicalSpecs = () => {
      // Valores base para definir características com base no tipo de veículo
      const baseData = {
        'Sedan': {
          motor: ['1.0', '1.6', '2.0'],
          potencia: [75, 120, 170],
          torque: [10, 16, 21],
          cambio: ['Manual de 5 marchas', 'Automático de 6 marchas', 'CVT'],
          tracao: ['Dianteira'],
          combustivel: ['Flex', 'Gasolina'],
          portas: [4],
          comprimento: [4400, 4700],
          entreEixos: [2550, 2650],
          portaMalas: [480, 520]
        },
        'Hatchback': {
          motor: ['1.0', '1.4', '1.6'],
          potencia: [75, 95, 120],
          torque: [9.5, 13, 16],
          cambio: ['Manual de 5 marchas', 'Automático de 6 marchas'],
          tracao: ['Dianteira'],
          combustivel: ['Flex'],
          portas: [4],
          comprimento: [3900, 4100],
          entreEixos: [2450, 2550],
          portaMalas: [280, 350]
        },
        'SUV': {
          motor: ['1.6', '2.0', '2.5'],
          potencia: [120, 170, 200],
          torque: [16, 21, 25],
          cambio: ['Automático de 6 marchas', 'CVT', 'Automático de 9 marchas'],
          tracao: ['Dianteira', '4x2', '4x4'],
          combustivel: ['Flex', 'Gasolina', 'Diesel'],
          portas: [4, 5],
          comprimento: [4300, 4600],
          entreEixos: [2600, 2730],
          portaMalas: [420, 580]
        },
        'Picape': {
          motor: ['2.0', '2.5', '3.0'],
          potencia: [140, 180, 230],
          torque: [18, 24, 35],
          cambio: ['Manual de 6 marchas', 'Automático de 6 marchas'],
          tracao: ['4x2', '4x4'],
          combustivel: ['Diesel', 'Flex'],
          portas: [2, 4],
          comprimento: [5100, 5400],
          entreEixos: [2950, 3100],
          capacidadeCarga: [750, 1100]
        }
      };
      
      const data = baseData[vehicleType];
      const index = Math.floor(Math.random() * data.motor.length);
      
      // Ajustando para diesel se for picape ou SUV grande e tiver indicação no nome
      let combustivelFinal = data.combustivel[Math.floor(Math.random() * data.combustivel.length)];
      if ((vehicleType === 'Picape' || vehicleType === 'SUV') && 
          (nameLower.includes('diesel') || nameLower.includes('turbo d'))) {
        combustivelFinal = 'Diesel';
      }
      
      return {
        carroceria: vehicleType,
        motor: `${data.motor[index]} ${
          nameLower.includes('turbo') ? 'Turbo' : ''
        } ${combustivelFinal}`,
        potencia: `${data.potencia[index]} cv`,
        torque: `${data.torque[index]} kgfm`,
        cambio: data.cambio[Math.floor(Math.random() * data.cambio.length)],
        tracao: data.tracao[Math.floor(Math.random() * data.tracao.length)],
        combustivel: combustivelFinal,
        portas: data.portas[Math.floor(Math.random() * data.portas.length)],
        comprimento: `${data.comprimento[Math.floor(Math.random() * data.comprimento.length)]} mm`,
        entreEixos: `${data.entreEixos[Math.floor(Math.random() * data.entreEixos.length)]} mm`,
        portaMalas: vehicleType !== 'Picape' 
          ? `${data.portaMalas[Math.floor(Math.random() * data.portaMalas.length)]} litros`
          : `${data.capacidadeCarga[Math.floor(Math.random() * data.capacidadeCarga.length)]} kg de carga`
      };
    };
    
    // Calcular valor FIPE com base no ano e preço
    const calculateFipe = () => {
      // Vamos definir o valor FIPE como uma porcentagem do preço pedido
      // O valor real seria obtido de uma API, mas estamos simulando
      const variance = Math.random() * 0.3 - 0.15; // -15% a +15%
      const fipeRatio = 1 + variance;
      const fipeValue = carData.preco * fipeRatio;
      
      // Determinar se o preço é bom com base na relação com o FIPE
      let evaluation;
      if (carData.preco < fipeValue * 0.9) {
        evaluation = 'Preço abaixo da média de mercado, potencial boa oportunidade';
      } else if (carData.preco > fipeValue * 1.1) {
        evaluation = 'Preço acima da média de mercado, negocie com o vendedor';
      } else {
        evaluation = 'Preço alinhado com a média de mercado para este modelo';
      }
      
      return {
        valor: fipeValue.toFixed(2),
        razaoPrecoFipe: (carData.preco / fipeValue * 100).toFixed(0),
        avaliacao: evaluation
      };
    };
    
    // Gerar consumo estimado baseado no tipo e motor
    const generateFuelEfficiency = (specs) => {
      let baseCity, baseHighway;
      
      // Determinar consumo base por tipo de veículo e combustível
      if (specs.combustivel === 'Diesel') {
        baseCity = 8.5;
        baseHighway = 11.0;
      } else if (specs.combustivel === 'Flex') {
        // Etanol
        baseCity = 7.0;
        baseHighway = 9.0;
        // Gasolina - multiplicar por 1.4 para obter o valor
      } else {
        // Gasolina
        baseCity = 9.0;
        baseHighway = 12.0;
      }
      
      // Ajustar com base no tipo de veículo
      const typeMultiplier = {
        'Sedan': 1.0,
        'Hatchback': 1.1,
        'SUV': 0.85,
        'Picape': 0.7
      };
      
      // Ajustar com base no motor
      const engineMultiplier = specs.motor.includes('1.0') ? 1.2 :
                              specs.motor.includes('1.4') ? 1.1 :
                              specs.motor.includes('1.6') ? 1.0 :
                              specs.motor.includes('2.0') ? 0.9 :
                              0.8;
                              
      // Calcular valores finais
      const cityEfficiency = (baseCity * typeMultiplier[specs.carroceria] * engineMultiplier).toFixed(1);
      const highwayEfficiency = (baseHighway * typeMultiplier[specs.carroceria] * engineMultiplier).toFixed(1);
      
      // Para flex, adicionar valores de etanol
      const hasFlex = specs.combustivel === 'Flex';
      
      return {
        cidade: {
          gasolina: cityEfficiency,
          etanol: hasFlex ? (cityEfficiency / 1.4).toFixed(1) : null
        },
        estrada: {
          gasolina: highwayEfficiency,
          etanol: hasFlex ? (highwayEfficiency / 1.4).toFixed(1) : null
        },
        eficiencia: ageInYears <= 5 ? 'Boa' : ageInYears <= 10 ? 'Média' : 'Reduzida'
      };
    };
    
    // Gerar problemas comuns baseados no modelo e idade
    const generateCommonIssues = () => {
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
    
    // Gerar concorrentes diretos
    const generateCompetitors = () => {
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
        if (carData.nome.includes(key)) {
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
    
    // Gerar recomendações personalizadas
    const generateRecommendations = () => {
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
    
    // Gerar todos os componentes da análise
    const specs = generateTechnicalSpecs();
    const fipe = calculateFipe();
    const fuelEfficiency = generateFuelEfficiency(specs);
    const commonIssues = generateCommonIssues();
    const competitors = generateCompetitors();
    const recommendations = generateRecommendations();
    
    setAnalysis({
      specs,
      fipe,
      fuelEfficiency,
      commonIssues,
      competitors,
      recommendations
    });
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
                    R$ {Number(analysis.fipe.valor).toLocaleString('pt-BR')}
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