import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  Speed as SpeedIcon,
  CalendarToday as CalendarIcon,
  Favorite as FavoriteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { supabase } from '../config/supabaseClient';

const Favorites = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [favoriteCars, setFavoriteCars] = useState([]);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Carregar favoritos do localStorage
    const loadFavorites = async () => {
      setLoading(true);
      
      try {
        // Recuperar favoritos do localStorage
        const savedFavorites = localStorage.getItem('carFavorites');
        const favoritesList = savedFavorites ? JSON.parse(savedFavorites) : [];
        setFavorites(favoritesList);
        
        console.log('Favoritos encontrados no localStorage:', favoritesList);
        
        if (favoritesList.length === 0) {
          setFavoriteCars([]);
          setLoading(false);
          return;
        }
        
        // Buscar detalhes dos carros favoritos usando o nome
        const favoriteResults = [];
        
        for (const favorite of favoritesList) {
          // Buscar pelo nome exato do veículo
          const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .eq('nome', favorite.nome)
            .limit(1);
            
          if (error) {
            console.error('Erro ao buscar o carro:', error);
            continue;
          }
          
          if (data && data.length > 0) {
            favoriteResults.push(data[0]);
          } else {
            console.log('Nenhum carro encontrado com o nome:', favorite.nome);
            
            // Se não encontrar pelo nome exato, tenta uma busca parcial
            const { data: partialData, error: partialError } = await supabase
              .from('produtos')
              .select('*')
              .ilike('nome', `%${favorite.nome}%`)
              .limit(5);
              
            if (!partialError && partialData && partialData.length > 0) {
              // Adicionar o primeiro resultado que encontrar
              favoriteResults.push(partialData[0]);
              console.log('Encontrado por correspondência parcial:', partialData[0].nome);
            }
          }
        }
        
        console.log('Carros favoritos encontrados:', favoriteResults);
        
        setFavoriteCars(favoriteResults);
      } catch (err) {
        console.error('Erro ao carregar favoritos:', err);
        setError('Não foi possível carregar seus veículos favoritos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    loadFavorites();
  }, []);

  // Função para remover um carro dos favoritos
  const removeFavorite = (car) => {
    // Atualizar o estado local removendo pelo id
    const newFavorites = favorites.filter(fav => String(fav.id) !== String(car.id));
    setFavorites(newFavorites);
    
    // Atualizar o localStorage
    localStorage.setItem('carFavorites', JSON.stringify(newFavorites));
    
    // Atualizar a lista de carros exibidos
    setFavoriteCars(favoriteCars.filter(c => c.id !== car.id));
  };

  // Função para ver detalhes do carro
  const handleViewDetails = (car) => {
    navigate(`/cars/${car.id}`, { state: { carName: car.nome } });
  };
  
  // Função para analisar o veículo - corrigida
  const handleAnalyzeVehicle = (car) => {
    navigate(`/cars/analyze/${car.id}`, { state: { carName: car.nome } });
  };
  
  // Voltar para a busca
  const handleBackToSearch = () => {
    navigate('/cars');
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBackToSearch} sx={{ mr: 2 }}>
          Voltar para busca
        </Button>
        <Typography variant="h4" component="h1">
          Meus Favoritos
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {favorites.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <FavoriteIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Você ainda não tem favoritos
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Adicione veículos aos favoritos para encontrá-los facilmente mais tarde
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleBackToSearch}
              >
                Buscar Veículos
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                {favoriteCars.length} veículos favoritos
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {favoriteCars.map((car) => (
                  <Grid item xs={12} sm={6} lg={4} key={car.id}>
                    <Card 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        height: '100%',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={car.imagem || 'https://via.placeholder.com/300x200?text=Sem+Imagem'}
                          alt={car.nome}
                        />
                        <Tooltip title="Remover dos favoritos">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFavorite(car);
                            }}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              bgcolor: 'rgba(255, 255, 255, 0.8)',
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                color: 'error.main'
                              }
                            }}
                          >
                            <FavoriteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography 
                          variant="h6" 
                          component="h2" 
                          gutterBottom
                          sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.3,
                            height: '2.6em'
                          }}
                        >
                          {car.nome}
                        </Typography>
                        
                        <Typography 
                          variant="h6" 
                          color="primary" 
                          sx={{ fontWeight: 'bold', mb: 2 }}
                        >
                          R$ {car.preco.toLocaleString('pt-BR')}
                        </Typography>
                        
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                              <Typography variant="body2" color="text.secondary">
                                {car.ano}
                              </Typography>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={6}>
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
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {car.cidade}, {car.estado}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
                          <Button 
                            variant="outlined" 
                            color="secondary"
                            fullWidth
                            size="small"
                            onClick={() => handleAnalyzeVehicle(car)}  // Passar o objeto car completo
                          >
                            Analisar
                          </Button>
                          
                          <Button 
                            variant="contained" 
                            fullWidth
                            size="small"
                            onClick={() => handleViewDetails(car)}
                          >
                            Ver Detalhes
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default Favorites; 