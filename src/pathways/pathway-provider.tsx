import React, { createContext, useContext, ReactNode } from 'react';

interface PathwayProviderProps {
  children: ReactNode;
}

interface PathwayContextType {
  getPathway: (pathwayId: string, queryString?: string) => Promise<any>;
}

const PathwayContext = createContext<PathwayContextType | undefined>(undefined);

export const usePathway = () => {
  const context = useContext(PathwayContext);
  if (!context) {
    throw new Error('usePathway must be used within a PathwayProvider');
  }
  return context;
};

export const PathwayProvider: React.FC<PathwayProviderProps> = ({ children }) => {
  const getPathway = async (pathwayId: string, queryString?: string): Promise<any> => {
    const baseUrl = `/api/pathway/${pathwayId}`;
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch pathway: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching pathway:', error);
      throw error;
    }
  };

  const value: PathwayContextType = {
    getPathway,
  };

  return (
    <PathwayContext.Provider value={value}>
      {children}
    </PathwayContext.Provider>
  );
};