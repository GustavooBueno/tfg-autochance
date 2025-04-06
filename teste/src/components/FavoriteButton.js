import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useFavorites } from '../contexts/FavoritesContext';

const FavoriteButton = ({ car, size = 'medium', sx = {} }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const isCarFavorite = isFavorite(car.id);
  
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(car);
  };

  return (
    <Tooltip title={isCarFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
      <IconButton
        aria-label={isCarFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        onClick={handleToggleFavorite}
        size={size}
        sx={{
          color: isCarFavorite ? 'error.main' : 'inherit',
          ...sx
        }}
      >
        {isCarFavorite ? <Favorite /> : <FavoriteBorder />}
      </IconButton>
    </Tooltip>
  );
};

export default FavoriteButton; 