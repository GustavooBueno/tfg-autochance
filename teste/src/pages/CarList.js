import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  CardActions,
  Tooltip
} from '@mui/material';
import { 
  BuildCircle as BuildCircleIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import CarAnalysisModal from '../components/CarAnalysisModal';
import { useMecanicoAI } from '../contexts/MecanicoAIContext';

const CarList = () => {
  const navigate = useNavigate();
  const { generateQuickAnalysis } = useMecanicoAI();
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  const cars = [
    {
      id: 1,
      title: 'Toyota Corolla',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      price: 50000,
      image: 'https://images.unsplash.com/photo-1626072778346-0ab6604d39c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      description: 'Toyota Corolla em excelente estado'
    },
    {
      id: 2,
      title: 'Honda Civic',
      brand: 'Honda',
      model: 'Civic',
      year: 2019,
      price: 75000,
      image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      description: 'Honda Civic em perfeito estado'
    },
    {
      id: 3,
      title: 'Mitsubishi Lancer Evolution X',
      brand: 'Mitsubishi',
      model: 'Lancer Evolution X',
      year: 2015,
      price: 100000,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      description: 'Mitsubishi Lancer Evolution X com apenas 40.000 km'
    }
  ];

  const brands = ['Toyota', 'Honda', 'Volkswagen', 'Ford', 'Chevrolet'];

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || car.brand === selectedBrand;
    const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
    return matchesSearch && matchesBrand && matchesPrice;
  });

  const handleAnalysisClick = (carId) => {
    const analysis = generateQuickAnalysis(carId);
    setCurrentAnalysis(analysis);
    setAnalysisModalOpen(true);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Filtros */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filtros
            </Typography>
            
            <TextField
              fullWidth
              label="Buscar"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Marca</InputLabel>
              <Select
                value={selectedBrand}
                label="Marca"
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography gutterBottom>
              Faixa de Preço
            </Typography>
            <Slider
              value={priceRange}
              onChange={(event, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={200000}
              step={1000}
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              R$ {priceRange[0].toLocaleString()} - R$ {priceRange[1].toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        {/* Lista de Carros */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {filteredCars.map((car) => (
              <Grid item xs={12} sm={6} md={4} key={car.id}>
                <Card sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                    <FavoriteButton car={car} />
                  </Box>
                  <CardMedia
                    component="img"
                    height="200"
                    image={car.image}
                    alt={car.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3">
                      {car.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {car.brand} {car.model} - {car.year}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      R$ {car.price.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {car.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/cars/${car.id}`)}
                      sx={{ flex: 1 }}
                    >
                      Ver Detalhes
                    </Button>
                    <Tooltip title="Avaliação Técnica do Mecânico IA">
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => handleAnalysisClick(car.id)}
                        startIcon={<BuildCircleIcon />}
                        sx={{ ml: 1 }}
                      >
                        Análise
                      </Button>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Modal de Análise Técnica */}
      <CarAnalysisModal 
        open={analysisModalOpen}
        onClose={() => setAnalysisModalOpen(false)}
        analysis={currentAnalysis}
      />
    </Container>
  );
};

export default CarList; 