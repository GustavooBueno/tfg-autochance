import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip,
  Paper,
  Divider
} from '@mui/material';
import { 
  Star as StarIcon, 
  ArrowForward as ArrowForwardIcon, 
  LocalOffer as LocalOfferIcon,
  Speed as SpeedIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const featuredCars = [
    {
      id: 371147981716455917,
      nome: '2017 Hyundai ix35',
      preco: 84990,
      imagem: 'https://scontent.fguj3-1.fna.fbcdn.net/v/t45.5328-4/480480803_644565188229935_7541049663243884433_n.jpg?stp=c43.0.260.260a_dst-jpg_p261x260_tt6&_nc_cat=105&ccb=1-7&_nc_sid=247b10&_nc_eui2=AeG5bPhoxfsTG-ACjnIz3eYlES8h9Le9lq8RLyH0t72Wr7rmOEikOCGSS13SKhDWFH4c1JOUhFIbqVallCuazw-y&_nc_ohc=3Pbr8MbkVewQ7kNvwHwlarf&_nc_oc=Adm_44LVsJeVB5KGlU5Sy-gveDmCVxX40jMuca5b_Mqg7VPkZrrUvvk1czVUvutNEiM&_nc_zt=23&_nc_ht=scontent.fguj3-1.fna&_nc_gid=hqpKBgtdm0Ot7Z6FM-0Jyg&oh=00_AYGrND2l3fMT1gnVlUAYHEdgRou7cIGPj8T7MeeS2LEIlw&oe=67F75FFD',
      quilometragem: 94000,
      cidade: 'Itajubá',
      estado: 'Minas Gerais',
      ano: 2017,
      link: 'https://www.facebook.com/marketplace/item/1162862198432612/?ref=category_feed&referral_code=null&referral_story_type=post&tracking=browse_serp%3A394308fa-ca8a-443c-80d4-41fbe6056537&__tn__=!%3AD'
    },
    {
      id: 95933433916504782,
      nome: '1998 BMW 323ia sport 2.5 6cc',
      preco: 39990,
      imagem: 'https://scontent.fguj3-1.fna.fbcdn.net/v/t45.5328-4/487832853_527720843411373_7578704052252291842_n.jpg?stp=c43.0.260.260a_dst-jpg_p261x260_tt6&_nc_cat=107&ccb=1-7&_nc_sid=247b10&_nc_eui2=AeF6XJeYF7YLQKP6lWLUitIpP67fO3HrVe4_rt87cetV7jkW7CF5o-JZziq58bMdv0P71trCQJ5rkFqR7L-TKzma&_nc_ohc=V9vEaP6No5EQ7kNvwF4Yxxw&_nc_oc=AdloMezk1PjFPozTySGT9eJKJGS_VlRgkzcMf_W9ZhCc9maxXwLg3oEz39P7QEYPJ-g&_nc_zt=23&_nc_ht=scontent.fguj3-1.fna&_nc_gid=hqpKBgtdm0Ot7Z6FM-0Jyg&oh=00_AYH5AcuDGAGh24hrZ2g7zxpkHXdwbqHlxK_YLK-lD7FjfA&oe=67F77FEF',
      quilometragem: 100000,
      cidade: 'Itajubá',
      estado: 'Minas Gerais',
      ano: 1998,
      link: 'https://www.facebook.com/marketplace/item/4047920382121253/?ref=category_feed&referral_code=null&referral_story_type=post&tracking=browse_serp%3A394308fa-ca8a-443c-80d4-41fbe6056537&__tn__=!%3AD'
    },
    {
      id: 28990562545659680,
      nome: '2020 Volkswagen fox conect 1.6',
      preco: 61990,
      imagem: 'https://scontent.fguj3-1.fna.fbcdn.net/v/t45.5328-4/481187999_619545564036924_5985566582143496528_n.jpg?stp=c30.0.260.260a_dst-jpg_p261x260_tt6&_nc_cat=100&ccb=1-7&_nc_sid=247b10&_nc_eui2=AeGS0rYXo8uFDHfPhpUZ66G0l8knHa9e6w2XyScdr17rDedenSf7pWtnjwddyBjgUKY7xlnfDAikJakFGfsrsO_f&_nc_ohc=QZugF159y7kQ7kNvwG_cWOM&_nc_oc=AdmWnbdzOWGR7jtYoVwO_kM2mo5a8UhTCf_m5b0SlaicYneXU_Rjb_N5-6ayZrHhtfA&_nc_zt=23&_nc_ht=scontent.fguj3-1.fna&_nc_gid=hqpKBgtdm0Ot7Z6FM-0Jyg&oh=00_AYG2BmZMJ4UWrxAYVzn6A2AHkePFAWoFUUBZLgOJ8Vhd9Q&oe=67F76FF4',
      quilometragem: 90000,
      cidade: 'Itajubá',
      estado: 'Minas Gerais',
      ano: 2020,
      link: 'https://www.facebook.com/marketplace/item/1167954551541094/?ref=category_feed&referral_code=null&referral_story_type=post&tracking=browse_serp%3A394308fa-ca8a-443c-80d4-41fbe6056537&__tn__=!%3AD'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Encontre o Carro dos Seus Sonhos
          </Typography>
          <Typography variant="h5" gutterBottom>
            A melhor plataforma de venda de carros usados do Brasil
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 2 }}
            onClick={() => navigate('/cars')}
          >
            Ver Carros Disponíveis
          </Button>
        </Container>
      </Box>

      {/* Featured Cars Section */}
      <Container sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <StarIcon sx={{ color: 'secondary.main', mr: 1, fontSize: 30 }} />
          <Typography variant="h4" component="h2">
            Carros em Destaque
          </Typography>
        </Box>
        
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Confira os melhores anúncios selecionados 
        </Typography>
        
        <Grid container spacing={4}>
          {featuredCars.map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={car.imagem}
                    alt={car.nome}
                  />
                  <Chip 
                    icon={<StarIcon />} 
                    label="Destaque" 
                    color="secondary"
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10,
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    {car.nome}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {car.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {car.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SpeedIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {car.quilometragem} km
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {car.cidade}, {car.estado}
                    </Typography>
                  </Box>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => {
                      console.log("Navegando para o carro:", car);
                      navigate(`/cars/${car.id}`, { 
                        state: { 
                          car: car,  // Passar o objeto completo do carro
                          carName: car.nome 
                        } 
                      });
                    }}
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/cars')}
          >
            Ver Todos os Carros
          </Button>
        </Box>
      </Container>
      
      {/* Call to Action - Destacar Anúncio */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 8, mb: 6 }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h4" component="h2" gutterBottom>
                Quer vender seu carro mais rápido?
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Destaque seu anúncio na nossa plataforma!
              </Typography>
              <Typography paragraph>
                Por apenas <strong>R$ 15,00</strong>, seu anúncio aparecerá em destaque na página inicial,
                aumentando a visibilidade e acelerando a venda do seu veículo.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Chip icon={<StarIcon />} label="Mais visibilidade" color="primary" />
                <Chip icon={<LocalOfferIcon />} label="Apenas R$ 15,00" color="primary" />
                <Chip icon={<SpeedIcon />} label="Venda mais rápido" color="primary" />
              </Box>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<StarIcon />}
                onClick={() => navigate('/destacar-anuncio')}
              >
                Destacar Meu Anúncio
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper 
                elevation={8} 
                sx={{ 
                  p: 4, 
                  bgcolor: 'secondary.light', 
                  color: 'white',
                  textAlign: 'center',
                  borderRadius: 4
                }}
              >
                <StarIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Por que destacar seu anúncio?
                </Typography>
                <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Box sx={{ textAlign: 'left' }}>
                  <Typography paragraph>
                    ✓ Mais visualizações
                  </Typography>
                  <Typography paragraph>
                    ✓ Posição privilegiada na página inicial
                  </Typography>
                  <Typography paragraph>
                    ✓ Visual diferenciado com selo de destaque
                  </Typography>
                  <Typography>
                    ✓ Maior chance de venda rápida
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 