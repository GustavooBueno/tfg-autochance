import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  DirectionsCar as DirectionsCarIcon,
  LocalGasStation as LocalGasStationIcon,
  AttachMoney as AttachMoneyIcon,
  Warning as WarningIcon,
  Compare as CompareIcon,
  Build as BuildIcon,
  VerifiedUser as VerifiedUserIcon,
  SmartToy as SmartToyIcon,
} from '@mui/icons-material';

const CarAnalysisModal = ({ open, onClose, analysis }) => {
  if (!analysis) return null;

  const { 
    car, 
    fipeComparison, 
    sizeDescription, 
    economyDescription, 
    problems, 
    competitors,
    maintenanceCost,
    reliability
  } = analysis;

  const getMaintenanceColor = (cost) => {
    if (cost === 'Baixo') return 'success';
    if (cost === 'Médio') return 'warning';
    return 'error';
  };

  const getReliabilityColor = (reliability) => {
    if (reliability === 'Alta') return 'success';
    if (reliability === 'Média') return 'warning';
    return 'error';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon color="primary" />
          <Typography variant="h6">
            Análise Técnica do Mecânico IA
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50 }}>
              <DirectionsCarIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h5">
                {car.brand} {car.model} {car.year}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                R$ {car.price.toLocaleString()}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body1" paragraph>
            Este é um veículo {sizeDescription} e {economyDescription}.
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Avaliação de Preço</Typography>
              </Box>
              <Typography variant="body1" paragraph>
                Preço anunciado: <strong>R$ {car.price.toLocaleString()}</strong>
              </Typography>
              <Typography variant="body1" paragraph>
                {fipeComparison}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WarningIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Problemas Crônicos Conhecidos</Typography>
              </Box>
              <List dense>
                {problems.map((problem, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: 30 }}>•</ListItemIcon>
                    <ListItemText primary={problem} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocalGasStationIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Consumo e Desempenho</Typography>
              </Box>
              <Typography variant="body1" paragraph>
                <strong>Motor:</strong> {car.power}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Consumo:</strong> {car.consumption}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Transmissão:</strong> {car.transmission}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CompareIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Concorrentes Diretos</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {competitors.map((competitor, index) => (
                  <Chip key={index} label={competitor} />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <BuildIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Custo de Manutenção</Typography>
            </Box>
            <Chip 
              label={maintenanceCost} 
              color={getMaintenanceColor(maintenanceCost)} 
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <VerifiedUserIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Confiabilidade</Typography>
            </Box>
            <Chip 
              label={reliability} 
              color={getReliabilityColor(reliability)} 
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ bgcolor: 'primary.light', p: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Conclusão do Mecânico IA
          </Typography>
          <Typography variant="body1">
            {car.brand} {car.model} é um veículo {car.size.toLowerCase()} {economyDescription.split(',')[0]}
            {reliability === 'Alta' 
              ? ' e com alta confiabilidade'
              : reliability === 'Média'
              ? ' e com confiabilidade média'
              : ' mas com baixa confiabilidade'}.
            {maintenanceCost === 'Baixo'
              ? ' O custo de manutenção é baixo, o que é um ponto positivo para o proprietário.'
              : maintenanceCost === 'Médio'
              ? ' O custo de manutenção é médio, dentro do esperado para esta categoria.'
              : ' O custo de manutenção é alto, o que deve ser considerado na decisão de compra.'}
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarAnalysisModal; 