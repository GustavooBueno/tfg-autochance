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
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  Speed as SpeedIcon,
  CalendarToday as CalendarIcon,
  Sort as SortIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import CarFilters from '../components/CarFilters';
import { supabase } from '../config/supabaseClient';

const CarSearch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  
  // Estados para ordenação
  const [sortField, setSortField] = useState('preco');
  const [sortDirection, setSortDirection] = useState('asc');
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Adicionar estados para paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 6; // 6 carros por página (3 linhas x 2 colunas)
  
  // Verificar se o menu está aberto
  const open = Boolean(anchorEl);
  
  // Opções de ordenação
  const sortOptions = [
    { field: 'preco', label: 'Preço' },
    { field: 'ano', label: 'Ano' },
    { field: 'quilometragem', label: 'Quilometragem' },
    { field: 'nome', label: 'Nome' }
  ];

  // Modificar estado para controlar os favoritos
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Carregar todos os carros ao montar o componente
    fetchCars();
    
    // Carregar favoritos do localStorage
    const loadFavorites = () => {
      const savedFavorites = localStorage.getItem('carFavorites');
      if (savedFavorites) {
        try {
          const parsedFavorites = JSON.parse(savedFavorites);
          setFavorites(parsedFavorites);
        } catch (error) {
          console.error('Erro ao carregar favoritos:', error);
          setFavorites([]);
        }
      }
    };
    
    loadFavorites();
  }, []);

  const fetchCars = async (filters = {}, currentPage = page, field = sortField, direction = sortDirection) => {
    setLoading(true);
    setError(null);
    
    try {
      // Primeiro, fazemos uma consulta para contar o total de resultados
      let countQuery = supabase.from('produtos').select('id', { count: 'exact' });
      
      // Aplicar os filtros na consulta de contagem
      if (filters.nome) {
        countQuery = countQuery.ilike('nome', `%${filters.nome}%`);
      }
      
      if (filters.precoMin !== undefined) {
        countQuery = countQuery.gte('preco', filters.precoMin);
      }
      
      if (filters.precoMax !== undefined) {
        countQuery = countQuery.lte('preco', filters.precoMax);
      }
      
      if (filters.anoMin !== undefined) {
        countQuery = countQuery.gte('ano', filters.anoMin);
      }
      
      if (filters.anoMax !== undefined) {
        countQuery = countQuery.lte('ano', filters.anoMax);
      }
      
      if (filters.quilometragemMin !== undefined) {
        countQuery = countQuery.gte('quilometragem', filters.quilometragemMin);
      }
      
      if (filters.quilometragemMax !== undefined) {
        countQuery = countQuery.lte('quilometragem', filters.quilometragemMax);
      }
      
      if (filters.estadoNome) {
        countQuery = countQuery.eq('estado', filters.estadoNome);
      } else if (filters.estado) {
        countQuery = countQuery.ilike('estado', `%${filters.estado}%`);
      }
      
      if (filters.cidade) {
        countQuery = countQuery.ilike('cidade', `%${filters.cidade}%`);
      }
      
      const { count, error: countError } = await countQuery;
      
      if (countError) throw countError;
      
      // Calcular total de páginas
      const calculatedTotalPages = Math.ceil(count / itemsPerPage);
      setTotalCount(count);
      setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
      
      // Agora fazemos a consulta para buscar os dados da página atual
      let dataQuery = supabase.from('produtos').select('*');
      
      // Aplicar os filtros na consulta de dados
      if (filters.nome) {
        dataQuery = dataQuery.ilike('nome', `%${filters.nome}%`);
      }
      
      if (filters.precoMin !== undefined) {
        dataQuery = dataQuery.gte('preco', filters.precoMin);
      }
      
      if (filters.precoMax !== undefined) {
        dataQuery = dataQuery.lte('preco', filters.precoMax);
      }
      
      if (filters.anoMin !== undefined) {
        dataQuery = dataQuery.gte('ano', filters.anoMin);
      }
      
      if (filters.anoMax !== undefined) {
        dataQuery = dataQuery.lte('ano', filters.anoMax);
      }
      
      if (filters.quilometragemMin !== undefined) {
        dataQuery = dataQuery.gte('quilometragem', filters.quilometragemMin);
      }
      
      if (filters.quilometragemMax !== undefined) {
        dataQuery = dataQuery.lte('quilometragem', filters.quilometragemMax);
      }
      
      if (filters.estadoNome) {
        dataQuery = dataQuery.eq('estado', filters.estadoNome);
      } else if (filters.estado) {
        dataQuery = dataQuery.ilike('estado', `%${filters.estado}%`);
      }
      
      if (filters.cidade) {
        dataQuery = dataQuery.ilike('cidade', `%${filters.cidade}%`);
      }
      
      // Aplicar ordenação com os parâmetros passados
      dataQuery = dataQuery.order(field, { ascending: direction === 'asc' });
      
      // Aplicar paginação
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      dataQuery = dataQuery.range(from, to);
      
      const { data, error: dataError } = await dataQuery;
      
      if (dataError) throw dataError;
      
      setCars(data);
    } catch (error) {
      console.error('Erro ao buscar carros:', error);
      setError('Falha ao carregar os dados. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    setPage(1); // Resetar para a primeira página quando filtros mudam
    fetchCars(filters, 1);
  };

  // Função para lidar com a mudança de página
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    // Passar explicitamente o campo e a direção de ordenação
    fetchCars(activeFilters, newPage, sortField, sortDirection);
    
    // Rolar para o topo da lista quando mudar de página
    window.scrollTo({
      top: document.getElementById('search-results').offsetTop - 100,
      behavior: 'smooth'
    });
  };

  // Função para ordenar os carros
  const handleSortFieldChange = (field) => {
    let newDirection = sortDirection;
    
    if (field === sortField) {
      // Se o campo for o mesmo, inverte a direção
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
    } else {
      // Se for um novo campo, define como ascendente
      setSortField(field);
      newDirection = 'asc';
      setSortDirection('asc');
    }
    
    // Resetar para primeira página ao mudar ordenação
    setPage(1);
    
    // Aplicar a ordenação com os novos valores
    fetchCars(activeFilters, 1, field, newDirection);
    
    handleSortClose();
  };

  // Abrir menu de ordenação
  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Fechar menu de ordenação
  const handleSortClose = () => {
    setAnchorEl(null);
  };

  // Função para navegar para a página de detalhes do carro
  const handleViewDetails = (car) => {
    console.log("Navegando para detalhes do carro:", car.nome);
    // Passar o nome do carro no state da navegação
    navigate(`/cars/${car.id}`, { state: { carName: car.nome } });
  };

  // Função para navegar para a página de análise do carro - corrigida
  const handleAnalyzeVehicle = (car) => {
    console.log("Navegando para análise do carro:", car.nome);
    // Passar o nome do carro no state da navegação
    navigate(`/cars/analyze/${car.id}`, { state: { carName: car.nome } });
  };

  // Função para alternar favorito
  const toggleFavorite = (car) => {
    // Armazenar o objeto com ID e nome
    const carInfo = { id: car.id, nome: car.nome };
    const carId = String(car.id);
    
    // Verificar se já é favorito
    const isFavorite = favorites.some(fav => String(fav.id) === carId);
    
    let newFavorites;
    if (isFavorite) {
      // Remover dos favoritos
      newFavorites = favorites.filter(fav => String(fav.id) !== carId);
    } else {
      // Adicionar aos favoritos
      newFavorites = [...favorites, carInfo];
    }
    
    // Atualizar estado
    setFavorites(newFavorites);
    
    // Salvar no localStorage
    localStorage.setItem('carFavorites', JSON.stringify(newFavorites));
    
    console.log('Favoritos atualizados:', newFavorites);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Busca de Veículos
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Encontre o carro perfeito para você
      </Typography>
      
      <Divider sx={{ my: 3 }} />
      
      <Grid container spacing={3}>
        {/* Área de filtros */}
        <Grid item xs={12} md={4} lg={3}>
          <CarFilters onFilterChange={handleFilterChange} />
        </Grid>
        
        {/* Lista de carros */}
        <Grid item xs={12} md={8} lg={9} id="search-results">
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  {totalCount} veículos encontrados
                </Typography>
                <Button 
                  startIcon={<SortIcon />} 
                  variant="outlined"
                  onClick={handleSortClick}
                  endIcon={sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                >
                  Ordenar por: {sortOptions.find(option => option.field === sortField)?.label}
                </Button>
                
                {/* Menu de ordenação */}
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleSortClose}
                >
                  {sortOptions.map((option) => (
                    <MenuItem 
                      key={option.field}
                      onClick={() => handleSortFieldChange(option.field)}
                      selected={sortField === option.field}
                    >
                      <ListItemText primary={option.label} />
                      {sortField === option.field && (
                        <ListItemIcon sx={{ minWidth: 'auto', ml: 1 }}>
                          {sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                        </ListItemIcon>
                      )}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              
              {cars.length === 0 ? (
                <Box sx={{ py: 5, textAlign: 'center' }}>
                  <Typography variant="h6">
                    Nenhum veículo encontrado com esses filtros
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Tente ajustar os filtros para encontrar mais opções
                  </Typography>
                </Box>
              ) : (
                <>
                  <Grid container spacing={3}>
                    {cars.map((car) => (
                      <Grid item xs={12} sm={6} lg={6} key={car.id}>
                        <Card 
                          sx={{ 
                            display: 'flex', 
                            flexDirection: { xs: 'column', sm: 'row' },
                            height: '100%',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            overflow: 'hidden',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                            }
                          }}
                        >
                          <Box 
                            sx={{ 
                              position: 'relative',
                              width: { xs: '100%', sm: '40%', md: '35%' },
                              minWidth: { sm: '180px' },
                              maxWidth: { sm: '200px' },
                              flexShrink: 0
                            }}
                          >
                            {/* Botão de favorito */}
                            <Tooltip title={favorites.some(fav => String(fav.id) === String(car.id)) ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(car);
                                }}
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                                  zIndex: 1,
                                  '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                  }
                                }}
                                size="small"
                              >
                                {favorites.some(fav => String(fav.id) === String(car.id)) ? (
                                  <FavoriteIcon color="error" />
                                ) : (
                                  <FavoriteBorderIcon />
                                )}
                              </IconButton>
                            </Tooltip>
                            <CardMedia
                              component="img"
                              sx={{ 
                                height: { xs: '180px', sm: '100%' },
                                objectFit: 'cover',
                                aspectRatio: '4/3'
                              }}
                              image={car.imagem || 'https://via.placeholder.com/300x200?text=Sem+Imagem'}
                              alt={car.nome}
                            />
                          </Box>
                          <CardContent 
                            sx={{ 
                              flex: '1 1 auto', 
                              display: 'flex', 
                              flexDirection: 'column',
                              p: { xs: 2, sm: 2.5 },
                              width: { sm: '60%', md: '65%' },
                              overflow: 'hidden'
                            }}
                          >
                            <Box sx={{ mb: 1, flex: '0 0 auto' }}>
                              <Typography 
                                component="h2" 
                                variant="h6"
                                sx={{ 
                                  mb: 0.5,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  lineHeight: 1.3,
                                  maxHeight: '2.6em'
                                }}
                              >
                                {car.nome}
                              </Typography>
                              
                              <Typography 
                                variant="h6" 
                                color="primary" 
                                sx={{ 
                                  fontWeight: 'bold',
                                  mb: 1,
                                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                                }}
                              >
                                R$ {car.preco.toLocaleString('pt-BR')}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ my: 1, flex: '0 0 auto', maxWidth: '100%' }}>
                              <Grid container spacing={1}>
                                <Grid item xs={6}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '100%' }}>
                                    <CalendarIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, flexShrink: 0 }} />
                                    <Typography 
                                      variant="body2" 
                                      color="text.secondary" 
                                      noWrap
                                      sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                                    >
                                      {car.ano}
                                    </Typography>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={6}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '100%' }}>
                                    <SpeedIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, flexShrink: 0 }} />
                                    <Typography 
                                      variant="body2" 
                                      color="text.secondary" 
                                      noWrap
                                      sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                                    >
                                      {car.quilometragem.toLocaleString('pt-BR')} km
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, maxWidth: '100%' }}>
                                <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, flexShrink: 0 }} />
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: 'calc(100% - 24px)',
                                    fontSize: { xs: '0.75rem', md: '0.875rem' }
                                  }}
                                >
                                  {car.cidade}, {car.estado}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Box sx={{ mt: 'auto', pt: 1.5, width: '100%', display: 'flex', gap: 2, justifyContent: 'center' }}>
                              <Button 
                                variant="outlined" 
                                color="secondary"
                                sx={{ 
                                  minWidth: '100px',
                                  maxWidth: '50%',
                                  flex: 1,
                                  fontSize: { xs: '0.75rem', md: '0.8125rem' }
                                }}
                                size="small"
                                onClick={() => handleAnalyzeVehicle(car)}
                              >
                                Analisar
                              </Button>
                              
                              <Button 
                                variant="contained" 
                                sx={{ 
                                  minWidth: '100px',
                                  maxWidth: '50%',
                                  flex: 1,
                                  fontSize: { xs: '0.75rem', md: '0.8125rem' }
                                }}
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
                  
                  {/* Componente de paginação */}
                  {totalPages > 1 && (
                    <Stack 
                      spacing={2} 
                      sx={{ 
                        mt: 4, 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={handlePageChange} 
                        color="primary"
                        showFirstButton
                        showLastButton
                        size="large"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Página {page} de {totalPages}
                      </Typography>
                    </Stack>
                  )}
                </>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CarSearch; 