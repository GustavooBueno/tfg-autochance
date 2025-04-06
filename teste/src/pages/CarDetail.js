import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  DirectionsCar as DirectionsCarIcon,
  CalendarToday as CalendarTodayIcon,
  Speed as SpeedIcon,
  LocalGasStation as LocalGasStationIcon,
  ColorLens as ColorLensIcon,
  Build as BuildIcon,
  AttachMoney as AttachMoneyIcon,
  LocationOn as LocationOnIcon,
  BuildCircle as BuildCircleIcon
} from '@mui/icons-material';
import FavoriteButton from '../components/FavoriteButton';
import CarAnalysisModal from '../components/CarAnalysisModal';
import { useMecanicoAI } from '../contexts/MecanicoAIContext';

const CarDetail = () => {
  const { id } = useParams();
  const { generateQuickAnalysis } = useMecanicoAI();
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  // Simulando dados do carro (em um caso real, isso viria de uma API)
  const car = {
    id: 1,
    title: 'Mitsubishi Lancer Evolution X',
    brand: 'Mitsubishi',
    model: 'Lancer Evolution X',
    year: 2015,
    price: 100000,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    description: 'Mitsubishi Lancer Evolution X em excelente estado de conservação. Todas as revisões em dia, pneus novos, suspensão esportiva, freios de alta performance. Possui histórico de manutenção completo.',
    specifications: {
      mileage: '40.000 km',
      fuel: 'Gasolina',
      color: 'Branco',
      transmission: 'Manual',
      doors: 4,
      seats: 5
    },
    location: 'São Paulo, SP',
    seller: {
      name: 'João Silva',
      phone: '(11) 99999-9999',
      email: 'joao@email.com'
    }
  };

  const handleAnalysisClick = () => {
    const carIdInt = parseInt(id || '1');
    const analysis = generateQuickAnalysis(carIdInt);
    setCurrentAnalysis(analysis);
    setAnalysisModalOpen(true);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Imagem Principal */}
        <Grid item xs={12}>
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={car.image}
              alt={car.title}
              sx={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: 1,
                mb: 2
              }}
            />
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <FavoriteButton car={car} size="large" />
            </Box>
          </Box>
        </Grid>

        {/* Informações Principais */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h4" component="h1">
              {car.title}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<BuildCircleIcon />}
              onClick={handleAnalysisClick}
            >
              Análise Técnica
            </Button>
          </Box>
          <Typography variant="h5" color="primary" gutterBottom>
            R$ {car.price.toLocaleString()}
          </Typography>
          <Typography variant="body1" paragraph>
            {car.description}
          </Typography>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Especificações
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <DirectionsCarIcon />
                    </ListItemIcon>
                    <ListItemText primary="Marca/Modelo" secondary={`${car.brand} ${car.model}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarTodayIcon />
                    </ListItemIcon>
                    <ListItemText primary="Ano" secondary={car.year} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={6} sm={4}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <SpeedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Quilometragem" secondary={car.specifications.mileage} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocalGasStationIcon />
                    </ListItemIcon>
                    <ListItemText primary="Combustível" secondary={car.specifications.fuel} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={6} sm={4}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <ColorLensIcon />
                    </ListItemIcon>
                    <ListItemText primary="Cor" secondary={car.specifications.color} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BuildIcon />
                    </ListItemIcon>
                    <ListItemText primary="Câmbio" secondary={car.specifications.transmission} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Informações do Vendedor */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informações do Vendedor
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Nome" secondary={car.seller.name} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Telefone" secondary={car.seller.phone} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Email" secondary={car.seller.email} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon />
                </ListItemIcon>
                <ListItemText primary="Localização" secondary={car.location} />
              </ListItem>
            </List>
            <Divider sx={{ my: 2 }} />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<AttachMoneyIcon />}
            >
              Entrar em Contato
            </Button>
          </Paper>
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

export default CarDetail; 