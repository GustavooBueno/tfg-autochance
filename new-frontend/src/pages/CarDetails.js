import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardMedia
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  Speed as SpeedIcon,
  LocationOn as LocationOnIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { supabase } from '../config/supabaseClient';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const carName = location.state?.carName; // Receber o nome do carro via state
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data = null;

        // Verificar se o carro completo foi passado via state
        if (location.state?.car) {
          console.log("Veículo encontrado no state:", location.state.car);
          data = location.state.car;
        } 
        // Se não tiver no state, tenta buscar pelo ID
        else {
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
        }
        
        if (data) {
          setCar(data);
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
  }, [id, carName, location.state]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleContactSeller = () => {
    if (car && car.link) {
      // Verificar se o link começa com http:// ou https://
      const link = car.link.startsWith('http') ? car.link : `https://${car.link}`;
      window.open(link, '_blank'); // Abre o link em uma nova aba
    } else {
      // Fallback caso não tenha link - pode mostrar um alerta ou usar outro método de contato
      console.error('Link do vendedor não disponível');
      alert('Link de contato não disponível para este anúncio.');
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
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

      {car && (
        <>
          <Typography variant="h4" component="h1" gutterBottom>
            {car.nome}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {car.cidade}, {car.estado}
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            {/* Coluna da imagem */}
            <Grid item xs={12} md={6}>
              <Card elevation={4}>
                <CardMedia
                  component="img"
                  height="400"
                  image={car.imagem || 'https://via.placeholder.com/600x400?text=Sem+Imagem'}
                  alt={car.nome}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            </Grid>

            {/* Coluna dos detalhes */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AttachMoneyIcon sx={{ fontSize: 36, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h4" color="primary.main">
                    R$ {car.preco.toLocaleString('pt-BR')}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Características
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarIcon sx={{ color: 'text.secondary', mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Ano
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {car.ano}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SpeedIcon sx={{ color: 'text.secondary', mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Quilometragem
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {car.quilometragem.toLocaleString('pt-BR')} km
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <LocationOnIcon sx={{ color: 'text.secondary', mr: 1, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Localização
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {car.cidade}, {car.estado}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleContactSeller}
                  disabled={!car || !car.link}
                >
                  Contatar Vendedor
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default CarDetails; 