import React, { createContext, useState, useEffect, useContext } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  // Carrega os favoritos do localStorage ao iniciar
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Salva os favoritos no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Verifica se um carro está nos favoritos
  const isFavorite = (carId) => {
    return favorites.some(favorite => favorite.id === carId);
  };

  // Adiciona ou remove um carro dos favoritos
  const toggleFavorite = (car) => {
    setFavorites(prevFavorites => {
      if (isFavorite(car.id)) {
        return prevFavorites.filter(favorite => favorite.id !== car.id);
      } else {
        return [...prevFavorites, car];
      }
    });
  };

  // Remove um carro dos favoritos
  const removeFavorite = (carId) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(favorite => favorite.id !== carId)
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext; 