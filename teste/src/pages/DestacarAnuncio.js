import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  Grid,
  Divider,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  WhatsApp as WhatsAppIcon,
  ArrowForward as ArrowForwardIcon,
  LocalOffer as LocalOfferIcon,
  Speed as SpeedIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DestacarAnuncio = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    titulo: '',
    marca: '',
    modelo: '',
    ano: '',
    preco: '',
    telefone: '',
    email: '',
    nome: '',
    observacoes: ''
  });
  const [errors, setErrors] = useState({});

  // Reduzido para apenas 3 etapas, removendo a de pagamento
  const steps = ['Informações do Veículo', 'Dados de Contato', 'Confirmação'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Limpar o erro quando o campo é preenchido
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNext();
  };

  const formatWhatsAppMessage = () => {
    return encodeURIComponent(
      `Olá, gostaria de destacar meu anúncio no site de carros!\n\n` +
      `*Informações do Veículo:*\n` +
      `Título: ${formData.titulo}\n` +
      `Marca: ${formData.marca}\n` +
      `Modelo: ${formData.modelo}\n` +
      `Ano: ${formData.ano}\n` +
      `Preço: R$ ${formData.preco}\n\n` +
      `*Dados de Contato:*\n` +
      `Nome: ${formData.nome}\n` +
      `Email: ${formData.email}\n` +
      `Telefone: ${formData.telefone}\n\n` +
      `${formData.observacoes ? `Observações: ${formData.observacoes}\n\n` : ''}` +
      `Gostaria de saber como proceder para realizar o pagamento de R$ 15,00 e destacar este anúncio. Obrigado!`
    );
  };

  const handleWhatsAppRedirect = () => {
    const message = formatWhatsAppMessage();
    window.open(`https://wa.me/5519993626264?text=${message}`, '_blank');
  };

  const handleCancel = () => {
    navigate('/');
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informações do Veículo
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="titulo"
                  label="Título do Anúncio"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ex: Honda Civic EXL 2020 Completo"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="marca"
                  label="Marca"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="modelo"
                  label="Modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="ano"
                  label="Ano"
                  name="ano"
                  value={formData.ano}
                  onChange={handleChange}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="preco"
                  label="Preço (R$)"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="observacoes"
                  label="Observações (opcional)"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                type="submit"
              >
                Próximo
              </Button>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dados de Contato
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="nome"
                  label="Nome Completo"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="E-mail"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="telefone"
                  label="Telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handleBack}>
                Voltar
              </Button>
              <Button
                variant="contained"
                type="submit"
              >
                Próximo
              </Button>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Confirme seus Dados
            </Typography>
            
            <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Resumo
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Anúncio:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {formData.titulo || 'Não informado'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Veículo:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {formData.marca} {formData.modelo} {formData.ano}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Preço do veículo:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    R$ {formData.preco}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Contato:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {formData.nome}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Telefone:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {formData.telefone}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Para destacar seu anúncio, clique no botão abaixo para entrar em contato via WhatsApp. 
                    O valor para destacar seu anúncio é de <strong>R$ 15,00</strong> e as formas de pagamento 
                    serão informadas via WhatsApp.
                  </Alert>
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handleBack}>
                Voltar
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleWhatsAppRedirect}
                startIcon={<WhatsAppIcon />}
              >
                Enviar Mensagem no WhatsApp
              </Button>
            </Box>
          </Box>
        );
      default:
        return 'Passo desconhecido';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Destaque seu Anúncio
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Coloque seu veículo em destaque na página inicial por apenas R$ 15,00
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}
      </Paper>
      
      {/* Benefícios do anúncio em destaque */}
      <Paper elevation={2} sx={{ p: 3, bgcolor: '#f5f9ff', mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Benefícios do Anúncio em Destaque
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <VisibilityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="body1" gutterBottom fontWeight="medium">
                Maior Visibilidade
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Seu anúncio aparece na página inicial
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <LocalOfferIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="body1" gutterBottom fontWeight="medium">
                Apenas R$ 15,00
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Investimento de baixo custo
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <SpeedIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="body1" gutterBottom fontWeight="medium">
                Venda mais Rápido
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aumente suas chances de venda
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DestacarAnuncio; 