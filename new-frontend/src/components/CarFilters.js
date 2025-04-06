import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Slider, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Paper, 
  Button,
  Autocomplete,
  InputAdornment,
  Grid
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Clear as ClearIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';

// Mapeamento de siglas para nomes completos dos estados
const ESTADOS_MAPEAMENTO = {
  'AC': 'Acre',
  'AL': 'Alagoas',
  'AP': 'Amapá',
  'AM': 'Amazonas',
  'BA': 'Bahia',
  'CE': 'Ceará',
  'DF': 'Distrito Federal',
  'ES': 'Espírito Santo',
  'GO': 'Goiás',
  'MA': 'Maranhão',
  'MT': 'Mato Grosso',
  'MS': 'Mato Grosso do Sul',
  'MG': 'Minas Gerais',
  'PA': 'Pará',
  'PB': 'Paraíba',
  'PR': 'Paraná',
  'PE': 'Pernambuco',
  'PI': 'Piauí',
  'RJ': 'Rio de Janeiro',
  'RN': 'Rio Grande do Norte',
  'RS': 'Rio Grande do Sul',
  'RO': 'Rondônia',
  'RR': 'Roraima',
  'SC': 'Santa Catarina',
  'SP': 'São Paulo',
  'SE': 'Sergipe',
  'TO': 'Tocantins'
};

const CarFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    nome: '',
    nomeNormalized: '',
    precoMin: 0,
    precoMax: 10000000,
    anoMin: 1884,
    anoMax: new Date().getFullYear(),
    quilometragemMin: 0,
    quilometragemMax: 200000,
    cidade: '',
    cidadeNormalized: '',
    estado: ''
  });

  // Lista de estados brasileiros
  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 
    'SP', 'SE', 'TO'
  ];

  const handleFilterChange = (field, value) => {
    let newValue = value;

    // Se o campo for cidade ou nome, vamos manter o valor original para exibição
    // mas adicionar uma versão normalizada para busca
    if ((field === 'cidade' || field === 'nome') && typeof value === 'string') {
      // Mantém o valor original para exibição na interface
      const newFilters = { 
        ...filters, 
        [field]: value,
        // Adiciona um campo normalizado para busca (minúsculas, sem acentos)
        [`${field}Normalized`]: value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      };
      
      setFilters(newFilters);
      
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
      return;
    }

    const newFilters = { ...filters, [field]: newValue };
    setFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleSliderChange = (field, value) => {
    setFilters({
      ...filters,
      [`${field}Min`]: value[0],
      [`${field}Max`]: value[1]
    });
  };

  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  const clearFilters = () => {
    setFilters({
      nome: '',
      nomeNormalized: '',
      precoMin: 0,
      precoMax: 10000000,
      anoMin: 1884,
      anoMax: new Date().getFullYear(),
      quilometragemMin: 0,
      quilometragemMax: 200000,
      cidade: '',
      cidadeNormalized: '',
      estado: ''
    });
    
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  // Modificar a função handleEstadoChange
  const handleEstadoChange = (e) => {
    const siglaEstado = e.target.value;
    
    // Obter o nome completo do estado baseado na sigla selecionada
    const nomeCompletoEstado = siglaEstado ? ESTADOS_MAPEAMENTO[siglaEstado] : '';
    
    // Criar um objeto com os novos filtros
    const newFilters = { 
      ...filters, 
      estado: siglaEstado,       // Mantém a sigla para exibição na interface
      estadoNome: nomeCompletoEstado,  // Adiciona o nome completo para busca
      cidade: '' // Limpa a cidade ao mudar o estado
    };
    
    // Atualiza o estado local
    setFilters(newFilters);
    
    // Aplica os filtros imediatamente
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h6">Filtros de Busca</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Filtro de nome */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nome do veículo"
            variant="outlined"
            value={filters.nome}
            onChange={(e) => handleFilterChange('nome', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Filtro de preço */}
        <Grid item xs={12}>
          <Typography gutterBottom>
            Faixa de Preço: R$ {filters.precoMin.toLocaleString('pt-BR')} - R$ {filters.precoMax.toLocaleString('pt-BR')}
          </Typography>
          <Slider
            value={[filters.precoMin, filters.precoMax]}
            onChange={(e, newValue) => handleSliderChange('preco', newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={10000000}
            step={100000}
            valueLabelFormat={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <TextField
              label="Mín"
              variant="outlined"
              size="small"
              value={filters.precoMin}
              onChange={(e) => handleFilterChange('precoMin', Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
              sx={{ width: '48%' }}
            />
            <TextField
              label="Máx"
              variant="outlined"
              size="small"
              value={filters.precoMax}
              onChange={(e) => handleFilterChange('precoMax', Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
              sx={{ width: '48%' }}
            />
          </Box>
        </Grid>

        {/* Filtro de ano */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Ano - De</InputLabel>
            <Select
              value={filters.anoMin}
              label="Ano - De"
              onChange={(e) => handleFilterChange('anoMin', e.target.value)}
            >
              {Array.from({ length: new Date().getFullYear() - 1883 }, (_, i) => 1884 + i).map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Ano - Até</InputLabel>
            <Select
              value={filters.anoMax}
              label="Ano - Até"
              onChange={(e) => handleFilterChange('anoMax', e.target.value)}
            >
              {Array.from({ length: new Date().getFullYear() - 1883 }, (_, i) => 1884 + i).map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Filtro de quilometragem */}
        <Grid item xs={12}>
          <Typography gutterBottom>
            Quilometragem: {filters.quilometragemMin.toLocaleString('pt-BR')} - {filters.quilometragemMax.toLocaleString('pt-BR')} km
          </Typography>
          <Slider
            value={[filters.quilometragemMin, filters.quilometragemMax]}
            onChange={(e, newValue) => handleSliderChange('quilometragem', newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={200000}
            step={5000}
            valueLabelFormat={(value) => `${value.toLocaleString('pt-BR')} km`}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <TextField
              label="Mín (km)"
              variant="outlined"
              size="small"
              value={filters.quilometragemMin}
              onChange={(e) => handleFilterChange('quilometragemMin', Number(e.target.value))}
              sx={{ width: '48%' }}
            />
            <TextField
              label="Máx (km)"
              variant="outlined"
              size="small"
              value={filters.quilometragemMax}
              onChange={(e) => handleFilterChange('quilometragemMax', Number(e.target.value))}
              sx={{ width: '48%' }}
            />
          </Box>
        </Grid>

        {/* Filtro de estado - com feedback visual melhorado */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.estado}
              label="Estado"
              onChange={handleEstadoChange}
              sx={{
                // Destaca o campo quando um estado está selecionado
                ...(filters.estado && {
                  fontWeight: 'bold',
                  '& .MuiSelect-select': {
                    color: 'primary.main',
                  }
                })
              }}
            >
              <MenuItem value="">Todos os estados</MenuItem>
              {estados.map((estado) => (
                <MenuItem key={estado} value={estado}>{estado}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Filtro de cidade - alterado para campo de texto */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cidade"
            variant="outlined"
            value={filters.cidade}
            onChange={(e) => handleFilterChange('cidade', e.target.value)}
            disabled={!filters.estado}
            placeholder={filters.estado ? "Digite o nome da cidade" : "Selecione um estado primeiro"}
            InputProps={{
              startAdornment: filters.cidade ? (
                <InputAdornment position="start">
                  <LocationOnIcon fontSize="small" />
                </InputAdornment>
              ) : null,
            }}
          />
        </Grid>

        {/* Botões de ação - layout melhorado */}
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 3,
            gap: 3 // Adiciona espaçamento entre os botões
          }}>
            <Button 
              variant="outlined" 
              startIcon={<ClearIcon />}
              onClick={clearFilters}
              sx={{ 
                flex: '1',
                maxWidth: '45%' 
              }}
            >
              Limpar
            </Button>
            <Button 
              variant="contained" 
              startIcon={<SearchIcon />}
              onClick={applyFilters}
              sx={{ 
                flex: '1.5',
                maxWidth: '55%'
              }}
            >
              Buscar Veículos
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CarFilters; 