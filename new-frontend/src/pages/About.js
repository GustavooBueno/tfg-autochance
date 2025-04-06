import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Avatar, Divider, Paper, Chip, Link } from '@mui/material';
import { 
  Build as BuildIcon, 
  Security as SecurityIcon, 
  Speed as SpeedIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  DevicesOther as DevicesOtherIcon,
  DataObject as DataObjectIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const About = () => {
  return (
    <Container sx={{ py: 6 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom>
          Sobre o AutoChance
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Plataforma que facilita a busca de carros usados
        </Typography>
      </Box>

      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Projeto
          </Typography>
          <Typography variant="body1" paragraph>
            O AutoChance é uma plataforma inovadora que facilita a busca e compra de carros usados, 
            oferecendo ferramentas inteligentes para auxiliar os usuários em suas decisões.
          </Typography>
          <Typography variant="body1" paragraph>
            Desenvolvido como parte de um projeto acadêmico, o Autochance integra funcionalidades avançadas 
            como web scraping para obtenção de dados reais do mercado, análise técnica automatizada através do 
            Mecânico IA e um sistema de favoritos para ajudar os usuários a acompanhar os melhores anúncios.
          </Typography>
          <Typography variant="body1">
            Nossa missão é tornar o mercado de carros usados mais transparente e acessível para todos, fornecendo 
            informações relevantes e análises para que os compradores possam tomar decisões bem informadas.
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%', bgcolor: 'primary.light', color: 'white' }}>
            <Typography variant="h5" gutterBottom>
              Funcionalidades Principais
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 4 }}>
              <SearchIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Web Scraping</Typography>
                <Typography variant="body2">
                  Extração automática de anúncios de carros do Mercado Livre, OLX e Facebook Marketplace.
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <BuildIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Mecânico IA</Typography>
                <Typography variant="body2">
                  Análise técnica automatizada dos veículos
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Sistema de Favoritos</Typography>
                <Typography variant="body2">
                  Salve e organize os carros que mais te interessam
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 8 }} />

      <Typography variant="h4" textAlign="center" gutterBottom mb={4}>
        Tecnologias Utilizadas
      </Typography>
      
      <Grid container spacing={4} mb={6}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CodeIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h6">Frontend</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="React" color="primary" size="small" />
                <Chip label="Material UI" color="primary" size="small" />
                <Chip label="React Router" color="primary" size="small" />
                <Chip label="Axios" color="primary" size="small" />
                <Chip label="Context API" color="primary" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorageIcon color="secondary" sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h6">Backend</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Node.js" color="secondary" size="small" />
                <Chip label="Express" color="secondary" size="small" />
                <Chip label="Supabase" color="secondary" size="small" />
                <Chip label="RESTful API" color="secondary" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DataObjectIcon color="success" sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h6">Web Scraping</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Selenium" color="success" size="small" />
                <Chip label="BeautifulSoup" color="success" size="small" />
                <Chip label="Python" color="success" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DevicesOtherIcon color="info" sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h6">Implantação</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="GitHub" color="info" size="small" />
                <Chip label="Vercel" color="info" size="small" />
                <Chip label="Render" color="info" size="small" />
                <Chip label="Supabase" color="info" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box textAlign="center" mb={4}>
        <Typography variant="h5" gutterBottom>
          Desenvolvimento
        </Typography>
        <Typography variant="body1" paragraph>
          O AutoChance foi desenvolvido como um projeto acadêmico para demonstrar a integração 
          de diferentes tecnologias e técnicas de desenvolvimento web moderno.
        </Typography>
        <Typography variant="body1" paragraph>
          O código fonte está disponível no GitHub e pode ser usado como referência para estudos 
          sobre React, Node.js, web scraping e desenvolvimento de aplicações web no geral.
        </Typography>
        <Box mt={2}>
          <Chip 
            label="Repositório GitHub" 
            component={Link} 
            href="https://github.com/GustavooBueno/tfg-autochance" 
            target="_blank"
            clickable
            color="primary"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default About; 