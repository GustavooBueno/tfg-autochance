import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Contextos
import { FavoritesProvider } from './contexts/FavoritesContext';
import { MecanicoAIProvider } from './contexts/MecanicoAIContext';

// Componentes
import Navbar from './components/Navbar';

// Páginas
import Home from './pages/Home';
import CarList from './pages/CarList';
import CarDetail from './pages/CarDetail';
import Favorites from './pages/Favorites';
import MecanicoAI from './pages/MecanicoAI';
import About from './pages/About';
import DestacarAnuncio from './pages/DestacarAnuncio';
import CarSearch from './pages/CarSearch';
import CarDetails from './pages/CarDetails';
import CarAnalyze from './pages/CarAnalyze';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FavoritesProvider>
        <MecanicoAIProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<CarSearch />} />
              <Route path="/cars/:id" element={<CarDetails />} />
              <Route path="/cars/analyze/:id" element={<CarAnalyze />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/mecanico-ai" element={
                <MecanicoAIProvider>
                  <MecanicoAI />
                </MecanicoAIProvider>
              } />
              <Route path="/sobre" element={<About />} />
              <Route path="/destacar-anuncio" element={<DestacarAnuncio />} />
            </Routes>
          </Router>
        </MecanicoAIProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
