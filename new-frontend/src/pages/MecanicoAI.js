import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Stack,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ChatOutlined as ChatIcon,
  DirectionsCar as CarIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  AssistantPhoto as FlagIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useMecanicoAI } from '../contexts/MecanicoAIContext';

const MecanicoAI = () => {
  const navigate = useNavigate();
  const {
    loading,
    error,
    conversationState,
    setConversationState,
    setBudget,
    setProfile,
    setPriorities,
    resetConversation,
    getCarDetailsByName
  } = useMecanicoAI();
  
  const [budgetInput, setBudgetInput] = useState('');
  const [budgetError, setBudgetError] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [prioritiesError, setPrioritiesError] = useState('');
  
  // Resetar o mecânico AI quando o componente monta
  useEffect(() => {
    resetConversation();
  }, []);
  
  // Validar e enviar o orçamento
  const handleBudgetSubmit = () => {
    setBudgetError('');
    const budget = parseFloat(budgetInput.replace(/\D/g, ''));
    
    if (isNaN(budget) || budget <= 0) {
      setBudgetError('Por favor, informe um valor válido');
      return;
    }
    
    if (budget < 10000) {
      setBudgetError('O valor mínimo é R$ 10.000');
      return;
    }
    
    setBudget(budget);
  };
  
  // Enviar o perfil selecionado
  const handleProfileSubmit = () => {
    if (!selectedProfile) {
      return;
    }
    
    setProfile(selectedProfile);
  };
  
  // Gerenciar a seleção de prioridades
  const handlePriorityChange = (priority) => {
    setPrioritiesError('');
    
    if (selectedPriorities.includes(priority)) {
      setSelectedPriorities(selectedPriorities.filter(p => p !== priority));
    } else {
      if (selectedPriorities.length < 3) {
        setSelectedPriorities([...selectedPriorities, priority]);
      } else {
        setPrioritiesError('Selecione no máximo 3 prioridades');
      }
    }
  };
  
  // Enviar as prioridades selecionadas
  const handlePrioritiesSubmit = () => {
    if (selectedPriorities.length === 0) {
      setPrioritiesError('Selecione pelo menos uma prioridade');
      return;
    }
    
    setPriorities(selectedPriorities);
  };
  
  // Ver detalhes de um carro
  const handleViewDetails = async (car) => {
    // Buscar detalhes adicionais se necessário e navegar para a página de detalhes
    navigate(`/cars/${car.id}`, { state: { carName: car.nome } });
  };
  
  // Analisar um carro
  const handleAnalyzeCar = async (car) => {
    // Navegar para a página de análise
    navigate(`/cars/analyze/${car.id}`, { state: { carName: car.nome } });
  };
  
  // Renderizar o estágio atual da conversa
  const renderConversationStage = () => {
    switch (conversationState.stage) {
      case 'budget':
  return (
          <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Qual é o seu orçamento?
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Informe o valor máximo que você pretende investir no seu próximo veículo.
            </Typography>
            
            <TextField
              fullWidth
              label="Orçamento"
              variant="outlined"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="Ex: R$ 50.000"
              error={!!budgetError}
              helperText={budgetError}
              sx={{ mb: 3 }}
            />
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleBudgetSubmit}
            >
              Continuar
            </Button>
          </Paper>
        );
        
      case 'profile':
        return (
          <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Qual é o seu perfil?
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Escolha o perfil que melhor representa seu estilo de vida e uso do veículo:
            </Typography>
            
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
              >
                <FormControlLabel 
                  value="Família" 
                  control={<Radio />} 
                  label="Família - Priorizo espaço, segurança e conforto para todos"
                />
                <FormControlLabel 
                  value="Aventureiro" 
                  control={<Radio />} 
                  label="Aventureiro - Gosto de viajar, enfrentar diferentes terrenos e explorar"
                />
                <FormControlLabel 
                  value="Urbano" 
                  control={<Radio />} 
                  label="Urbano - Uso principalmente na cidade, busco praticidade e economia"
                />
                <FormControlLabel 
                  value="Luxo" 
                  control={<Radio />} 
                  label="Luxo - Valorizo acabamento, tecnologia e conforto premium"
                />
                <FormControlLabel 
                  value="Esportivo" 
                  control={<Radio />} 
                  label="Esportivo - Busco desempenho, dirigibilidade e emoção ao volante"
                />
              </RadioGroup>
            </FormControl>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={resetConversation}
              >
                Voltar
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleProfileSubmit}
                disabled={!selectedProfile}
              >
                Continuar
              </Button>
            </Box>
          </Paper>
        );
        
      case 'priorities':
        return (
          <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Quais são suas prioridades?
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              Selecione até 3 características mais importantes para você:
            </Typography>
            
            <Typography variant="body2" color="primary" sx={{ mb: 3 }}>
              {selectedPriorities.length}/3 selecionadas
            </Typography>
            
            {prioritiesError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {prioritiesError}
              </Alert>
            )}
            
            <Stack spacing={1}>
              {['Economia', 'Conforto', 'Espaço', 'Desempenho', 'Custo-benefício'].map((priority) => (
                <FormControlLabel
                  key={priority}
                  control={
                    <Checkbox 
                      checked={selectedPriorities.includes(priority)}
                      onChange={() => handlePriorityChange(priority)}
                      color="primary"
                    />
                  }
                  label={priority}
                                />
                              ))}
            </Stack>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setSelectedPriorities([]);
                  setProfile(selectedProfile);
                }}
              >
                Voltar
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handlePrioritiesSubmit}
                disabled={selectedPriorities.length === 0}
              >
                Ver Recomendações
              </Button>
            </Box>
          </Paper>
        );
        
      case 'recommendations':
        return (
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChatIcon color="primary" sx={{ fontSize: 28, mr: 2 }} />
                <Typography variant="h5">
                  Recomendações Personalizadas
                </Typography>
                            </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="body1" paragraph>
                Com base no seu orçamento de <strong>R$ {conversationState.budget.toLocaleString('pt-BR')}</strong>,
                perfil <strong>{conversationState.profile}</strong> e suas prioridades
                (<strong>{conversationState.priorities.join(', ')}</strong>), 
                selecionei os seguintes veículos para você:
              </Typography>
              
              {conversationState.selectedCars.length === 0 ? (
                <Alert severity="info" sx={{ my: 2 }}>
                  Não encontramos veículos que correspondam exatamente aos seus critérios.
                  Tente ajustar suas preferências.
                </Alert>
              ) : (
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  {conversationState.selectedCars.map((car) => (
                    <Grid item xs={12} md={6} lg={4} key={car.id}>
                      <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia
                                      component="img"
                          height="180"
                          image={car.imagem || 'https://via.placeholder.com/400x200?text=Sem+Imagem'}
                          alt={car.nome}
                        />
                        
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="div" gutterBottom>
                            {car.nome}
                          </Typography>
                          
                          <Typography variant="h6" color="primary" gutterBottom>
                            R$ {car.preco.toLocaleString('pt-BR')}
                                        </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <FlagIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {car.ano}
                                        </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CheckIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                              {car.quilometragem.toLocaleString('pt-BR')} km
                            </Typography>
                          </Box>
                          
                          {/* Mostrar as principais razões da recomendação */}
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" color="primary" gutterBottom>
                              Por que recomendamos:
                            </Typography>
                            <Typography variant="body2">
                              {conversationState.profile === 'Família' && 'Espaçoso e confortável para família.'}
                              {conversationState.profile === 'Aventureiro' && 'Versatilidade para aventuras.'}
                              {conversationState.profile === 'Urbano' && 'Prático e econômico para a cidade.'}
                              {conversationState.profile === 'Luxo' && 'Acabamento e recursos premium.'}
                              {conversationState.profile === 'Esportivo' && 'Desempenho e emoção ao dirigir.'}
                                        </Typography>
                          </Box>
                                      </CardContent>
                        
                        <CardActions sx={{ p: 2, pt: 0 }}>
                                        <Button 
                                          size="small" 
                                          variant="outlined"
                            onClick={() => handleAnalyzeCar(car)}
                            fullWidth
                                        >
                                          Analisar
                                        </Button>
                          <Button 
                            size="small" 
                            variant="contained" 
                            onClick={() => handleViewDetails(car)}
                            fullWidth
                          >
                            Ver Detalhes
                          </Button>
                        </CardActions>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
              )}
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                              <Button 
                                variant="outlined" 
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={resetConversation}
                >
                  Recomeçar
                              </Button>
              </Box>
            </Paper>
            </Box>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mecânico IA - Seu consultor automotivo
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Responda algumas perguntas e encontraremos o carro ideal para você
              </Typography>
            </Box>
          
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {!loading && renderConversationStage()}
    </Container>
  );
};

export default MecanicoAI; 