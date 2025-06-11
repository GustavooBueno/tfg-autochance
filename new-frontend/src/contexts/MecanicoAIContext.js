import React, { createContext, useState, useContext } from 'react';
import { supabase } from '../config/supabaseClient';

// Criando o contexto
const MecanicoAIContext = createContext();

// Mapeia o perfil do usuário para tipos de carroceria para a busca inicial no DB
const profileToCarroceria = {
  'Família': ['SUV', 'Sedan', 'Minivan'],
  'Aventureiro': ['SUV', 'Picape'],
  'Urbano': ['Hatchback', 'Sedan'],
  'Luxo': ['Sedan', 'SUV'],
  'Esportivo': ['Esportivo', 'Hatchback', 'Sedan'],
};

// Provider personalizado
export const MecanicoAIProvider = ({ children }) => {
  const initialState = {
    stage: 'budget',
    budget: null,
    profile: null,
    priorities: [],
    selectedCars: [],
  };
  
  const [conversationState, setConversationState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetConversation = () => {
    setConversationState(initialState);
    setError(null);
  };

  const setBudget = (value) => {
    setConversationState(prev => ({ ...prev, budget: value, stage: 'profile' }));
  };

  const setProfile = (value) => {
    setConversationState(prev => ({ ...prev, profile: value, stage: 'priorities' }));
  };

  const setPriorities = async (priorities) => {
    setLoading(true);
    setError(null);
    setConversationState(prev => ({ ...prev, priorities }));

    try {
      const { budget, profile } = conversationState;
      const targetCarrocerias = profileToCarroceria[profile] || [];
      
      let query = supabase
        .from('produtos')
        .select('*')
        .lte('preco', budget)
        .order('preco', { ascending: false });

      if (targetCarrocerias.length > 0) {
        query = query.in('carroceria', targetCarrocerias);
      }
      
      query = query.limit(10); 

      const { data: candidateCars, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      if (!candidateCars || candidateCars.length === 0) {
        setConversationState(prev => ({ ...prev, selectedCars: [], stage: 'recommendations' }));
        return;
      }

      console.log(`Enviando ${candidateCars.length} carros para o Ranker da IA...`);
      const response = await fetch('/api/ai_ranker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cars: candidateCars,
          priorities: priorities
        }),
      });

      if (!response.ok) {
        const errBody = await response.json();
        throw new Error(errBody.error || 'Falha ao receber o ranking da IA');
      }

      const rankedCars = await response.json();
      
      setConversationState(prev => ({ 
        ...prev, 
        selectedCars: rankedCars, 
        stage: 'recommendations' 
      }));

    } catch (err) {
      console.error("Erro no processo de recomendação da IA:", err);
      setError("Não foi possível obter as recomendações da IA. Tente novamente.");
      setConversationState(prev => ({ ...prev, selectedCars: [], stage: 'recommendations' }));
    } finally {
      setLoading(false);
    }
  };

  const getCarDetailsByName = async (carName) => {
    // Esta função pode ser usada para outros fins, se necessário.
  };

  return (
    <MecanicoAIContext.Provider value={{
      loading,
      error,
      conversationState,
      setConversationState,
      setBudget,
      setProfile,
      setPriorities,
      resetConversation,
      getCarDetailsByName
    }}>
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