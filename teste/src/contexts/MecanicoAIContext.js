import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

// Criando o contexto
const MecanicoAIContext = createContext();

// Provider personalizado
export const MecanicoAIProvider = ({ children }) => {
  // Estado para armazenar todos os carros disponíveis
  const [availableCars, setAvailableCars] = useState([]);
  // Estado para armazenar os carros filtrados
  const [filteredCars, setFilteredCars] = useState([]);
  // Estado para controlar o carregamento
  const [loading, setLoading] = useState(true);
  // Estado para controlar erro
  const [error, setError] = useState(null);
  // Estado da conversa
  const [conversationState, setConversationState] = useState({
    stage: 'budget', // Estágios: budget, profile, priorities, recommendations
    budget: null,
    profile: null, // Família, Aventureiro, Urbano, Luxo, Esportivo
    priorities: [], // Economia, Conforto, Espaço, Desempenho, Custo-benefício
    selectedCars: []
  });
  
  // Carrega os carros do Supabase quando o componente monta
  useEffect(() => {
    fetchCars();
  }, []);
  
  // Função para buscar carros do Supabase
  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*');
        
      if (error) throw error;
      
      console.log('Carros carregados do banco de dados:', data);
      setAvailableCars(data || []);
    } catch (err) {
      console.error('Erro ao carregar carros:', err);
      setError('Não foi possível carregar os veículos. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  // Função para definir o orçamento do usuário
  const setBudget = (budget) => {
    setConversationState(prev => ({
      ...prev,
      budget,
      stage: 'profile'
    }));
    
    // Filtrar carros pelo orçamento
    const filteredByBudget = availableCars.filter(car => car.preco <= budget);
    setFilteredCars(filteredByBudget);
  };
  
  // Função para definir o perfil do usuário
  const setProfile = (profile) => {
    setConversationState(prev => ({
      ...prev,
      profile,
      stage: 'priorities'
    }));
    
    // Filtrar carros pelo perfil
    let filtered = [...filteredCars];
    
    // Lógica de filtragem baseada no perfil selecionado
    switch (profile) {
      case 'Família':
        // Priorizar carros maiores, SUVs, minivans
        filtered = filtered.filter(car => {
          const nameLower = car.nome.toLowerCase();
          return nameLower.includes('suv') || 
                 nameLower.includes('sw') || 
                 nameLower.includes('wagon') || 
                 nameLower.includes('crossover') || 
                 car.nome.includes('Compass') || 
                 car.nome.includes('HR-V') || 
                 car.nome.includes('Creta') || 
                 car.quilometragem < 80000; // Carros com menos quilometragem para famílias
        });
        break;
        
      case 'Aventureiro':
        // Priorizar SUVs, picapes, 4x4
        filtered = filtered.filter(car => {
          const nameLower = car.nome.toLowerCase();
          return nameLower.includes('suv') || 
                 nameLower.includes('4x4') || 
                 nameLower.includes('trail') || 
                 nameLower.includes('cross') || 
                 nameLower.includes('jeep') || 
                 nameLower.includes('ranger') || 
                 nameLower.includes('hilux') || 
                 car.nome.includes('Compass') || 
                 car.nome.includes('Toro');
        });
        break;
        
      case 'Urbano':
        // Priorizar hatches, compactos, econômicos
        filtered = filtered.filter(car => {
          const nameLower = car.nome.toLowerCase();
          return nameLower.includes('hatch') || 
                 nameLower.includes('1.0') || 
                 nameLower.includes('1.3') || 
                 nameLower.includes('city') || 
                 nameLower.includes('fit') || 
                 nameLower.includes('onix') || 
                 nameLower.includes('gol') || 
                 nameLower.includes('polo') || 
                 car.ano > 2015; // Carros mais novos para uso urbano
        });
        break;
        
      case 'Luxo':
        // Priorizar marcas premium, equipados
        filtered = filtered.filter(car => {
          const nameLower = car.nome.toLowerCase();
          return nameLower.includes('mercedes') || 
                 nameLower.includes('bmw') || 
                 nameLower.includes('audi') || 
                 nameLower.includes('lexus') || 
                 nameLower.includes('volvo') || 
                 car.preco > conversationState.budget * 0.8; // Carros mais caros dentro do orçamento
        });
        break;
        
      case 'Esportivo':
        // Priorizar esportivos, potentes
        filtered = filtered.filter(car => {
          const nameLower = car.nome.toLowerCase();
          return nameLower.includes('turbo') || 
                 nameLower.includes('gti') || 
                 nameLower.includes('sport') || 
                 nameLower.includes('rs') || 
                 nameLower.includes('2.0') || 
                 nameLower.includes('golf') || 
                 nameLower.includes('civic si') || 
                 car.ano > 2015; // Carros mais novos para esportivos
        });
        break;
        
      default:
        // Sem filtragem adicional
        break;
    }
    
    // Se não encontrar carros suficientes com a filtragem rigorosa, use um filtro mais flexível
    if (filtered.length < 3) {
      filtered = filteredCars;
    }
    
    setFilteredCars(filtered);
  };
  
  // Função para definir as prioridades do usuário
  const setPriorities = (priorities) => {
    setConversationState(prev => ({
      ...prev,
      priorities,
      stage: 'recommendations'
    }));
    
    // Ordenar carros com base nas prioridades
    let orderedCars = [...filteredCars];
    
    // Função para calcular score de cada carro com base nas prioridades
    const calculateScore = (car) => {
      let score = 0;
      
      priorities.forEach((priority, index) => {
        // Peso maior para as primeiras prioridades (inversamente proporcional ao índice)
        const weight = 5 - index;
        
        switch (priority) {
          case 'Economia':
            // Preferir carros mais novos e com menos quilometragem
            score += weight * (2023 - car.ano) * -0.5; // Quanto mais novo, melhor
            score += weight * (car.quilometragem / 10000) * -1; // Quanto menos km, melhor
            
            // Preferir carros com nomes que indicam economia
            if (car.nome.toLowerCase().includes('1.0') || 
                car.nome.toLowerCase().includes('flex') || 
                car.nome.toLowerCase().includes('econom')) {
              score += weight * 10;
            }
          break;
          
          case 'Conforto':
            // Preferir sedãs, SUVs e carros mais caros (geralmente mais confortáveis)
            if (car.nome.toLowerCase().includes('sedan') || 
                car.nome.toLowerCase().includes('luxury') || 
                car.nome.toLowerCase().includes('comfort')) {
              score += weight * 10;
            }
            
            // Carros mais caros geralmente têm mais conforto
            score += weight * (car.preco / conversationState.budget) * 10;
          break;
          
          case 'Espaço':
            // Preferir SUVs, wagons, sedãs grandes
            if (car.nome.toLowerCase().includes('suv') || 
                car.nome.toLowerCase().includes('sw') || 
                car.nome.toLowerCase().includes('wagon') || 
                car.nome.toLowerCase().includes('space')) {
              score += weight * 15;
            }
          break;
          
          case 'Desempenho':
            // Preferir carros com motor maior ou turbo
            if (car.nome.toLowerCase().includes('2.0') || 
                car.nome.toLowerCase().includes('turbo') || 
                car.nome.toLowerCase().includes('sport') || 
                car.nome.toLowerCase().includes('gti')) {
              score += weight * 15;
            }
            
            // Preferir carros mais novos para melhor desempenho
            score += weight * (2023 - car.ano) * -1;
          break;
          
          case 'Custo-benefício':
            // Equilibrio entre preço, ano e quilometragem
            const priceRatio = 1 - (car.preco / conversationState.budget); // Quanto mais barato, melhor
            const ageRatio = (2023 - car.ano) / 10; // Idade em décadas
            const kmRatio = car.quilometragem / 100000; // Quilometragem em centenas de milhares
            
            score += weight * (priceRatio * 15 - ageRatio * 5 - kmRatio * 5);
          break;
          
        default:
            break;
        }
      });
      
      return score;
    };
    
    // Calcular score para cada carro e ordenar
    orderedCars = orderedCars.map(car => ({
      ...car,
      score: calculateScore(car)
    })).sort((a, b) => b.score - a.score);
    
    // Selecionar os 5 melhores carros
    const selectedCars = orderedCars.slice(0, 5);
    
    setConversationState(prev => ({
      ...prev,
      selectedCars
    }));
  };
  
  // Função para reiniciar a conversa
  const resetConversation = () => {
    setConversationState({
      stage: 'budget',
      budget: null,
      profile: null,
      priorities: [],
      selectedCars: []
    });
    setFilteredCars([]);
  };
  
  // Obter detalhes de um carro específico por nome
  const getCarDetailsByName = async (carName) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .ilike('nome', `%${carName}%`)
        .limit(1);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data[0];
      }
      
      return null;
    } catch (err) {
      console.error('Erro ao buscar detalhes do veículo:', err);
      return null;
    }
  };
  
  // Valores a serem disponibilizados pelo contexto
  const contextValue = {
    availableCars,
    filteredCars,
    loading,
    error,
    conversationState,
    setConversationState,
    setBudget,
    setProfile,
    setPriorities,
    resetConversation,
    getCarDetailsByName
  };
  
  return (
    <MecanicoAIContext.Provider value={contextValue}>
      {children}
    </MecanicoAIContext.Provider>
  );
};

// Hook personalizado para facilitar o uso do contexto
export const useMecanicoAI = () => {
  const context = useContext(MecanicoAIContext);
  if (!context) {
    throw new Error('useMecanicoAI deve ser usado dentro de um MecanicoAIProvider');
  }
  return context;
};

export default MecanicoAIContext; 