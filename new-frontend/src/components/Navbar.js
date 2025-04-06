import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  InputBase,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  DirectionsCar as DirectionsCarIcon,
  Favorite as FavoriteIcon,
  Info as InfoIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <DirectionsCarIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            AUTOCHANCE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/cars'); }}>
                <Typography textAlign="center">Carros</Typography>
              </MenuItem>
              <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/favorites'); }}>
                <Typography textAlign="center">Favoritos</Typography>
              </MenuItem>
              <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/mecanico-ai'); }}>
                <Typography textAlign="center">Mecânico IA</Typography>
              </MenuItem>
              <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/sobre'); }}>
                <Typography textAlign="center">Sobre</Typography>
              </MenuItem>
              <MenuItem 
                onClick={() => { handleCloseNavMenu(); navigate('/destacar-anuncio'); }}
                sx={{ color: 'secondary.main' }}
              >
                <StarIcon sx={{ mr: 1, fontSize: 'small' }} />
                <Typography textAlign="center">Destacar Anúncio</Typography>
              </MenuItem>
            </Menu>
          </Box>

          <DirectionsCarIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            AUTOCHANCE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              onClick={() => navigate('/cars')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Carros
            </Button>
            <Button
              onClick={() => navigate('/favorites')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Favoritos
            </Button>
            <Button
              onClick={() => navigate('/mecanico-ai')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Mecânico IA
            </Button>
            <Button
              onClick={() => navigate('/sobre')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Sobre
            </Button>
            <Button
              onClick={() => navigate('/destacar-anuncio')}
              startIcon={<StarIcon />}
              variant="contained"
              color="secondary"
              sx={{ my: 2, mx: 1 }}
            >
              Destacar Anúncio
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex' }}>
            <IconButton 
              onClick={() => navigate('/favorites')}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <FavoriteIcon />
            </IconButton>
            <IconButton 
              onClick={() => navigate('/sobre')}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <InfoIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 