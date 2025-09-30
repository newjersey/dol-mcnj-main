import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CompareTable } from './CompareTable';
import { ResultsContext, ContextProps } from './Results';
import { ResultProps } from '../../../../utils/types/components';

// Mock utility functions with actual implementations
jest.mock('../../../../utils/outcomeHelpers', () => ({
  formatPercentage: jest.fn((value: number | undefined, isDecimal = true) => {
    if (value === undefined || value === null) return 'N/A';
    const percentage = isDecimal ? value * 100 : value;
    return `${percentage.toFixed(1)}%`;
  }),
  formatSalary: jest.fn((value: number | undefined) => {
    if (value === undefined || value === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value || 0);
  }),
  getPercentEmployed: jest.fn((outcomes) => {
    if (!outcomes?.employment?.length) return undefined;
    return Math.max(...outcomes.employment.map((e: any) => e.employmentRate || 0));
  }),
  getCompletionRate: jest.fn((outcomes) => {
    return outcomes?.completion?.completionRate;
  }),
  getCredentialRate: jest.fn((outcomes) => {
    return outcomes?.completion?.credentialRate;
  }),
  getAverageSalary: jest.fn((outcomes) => {
    if (!outcomes?.employment?.length) return undefined;
    return outcomes.employment[0]?.medianAnnualSalary;
  }),
}));

// Mock other dependencies
jest.mock('../../../../utils/calendarLength', () => ({
  calendarLength: jest.fn((value) => `${value} months`)
}));

jest.mock('../../../../utils/toUsCurrency', () => ({
  toUsCurrency: jest.fn((value) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0))
}));

// Mock components
jest.mock('../../../../components/modules/Button', () => ({
  Button: ({ children, onClick, type }: any) => (
    <button onClick={onClick} type={type}>{children}</button>
  )
}));

jest.mock('../../../../components/modules/Tag', () => ({
  Tag: ({ title }: any) => <span>{title}</span>
}));

// Helper function to render with context
const renderWithContext = (compare: ResultProps[], setCompare = jest.fn()) => {
  const mockContextValue: ContextProps = {
    compare,
    setCompare,
    extractParam: jest.fn(() => null),
    itemsPerPage: '10',
    lang: 'en' as any,
    results: { programs: [], totalCount: 0 } as any,
    searchTerm: '',
    setItemsPerPage: jest.fn(),
    setResults: jest.fn(),
    setSearchTerm: jest.fn(),
    setSortValue: jest.fn(),
    setToggle: jest.fn(),
    sortValue: '',
    toggle: false,
  };

  return render(
    <ResultsContext.Provider value={mockContextValue}>
      <CompareTable />
    </ResultsContext.Provider>
  );
};

// Helper function to expand the table view
const expandTable = () => {
  const compareButton = screen.getByText('Compare');
  fireEvent.click(compareButton);
};

describe('CompareTable Consumer Report Card Integration', () => {
  const mockProgramWithOutcomes: ResultProps = {
    id: '1',
    name: 'Medical Assistant Program',
    totalCost: 15000,
    zipCode: '12345',
    outcomes: {
      completion: {
        exiters: 100,
        completers: 80,
        completionRate: 0.613,
        credentialRate: 0.75
      },
      employment: [
        {
          quarter: 2,
          employedCount: 70,
          employmentRate: 84.63,
          medianAnnualSalary: 48464
        }
      ]
    },
    providerName: 'Test Provider',
    city: 'Test City',
    county: 'Test County',
    cipDefinition: { cip: '51.0801', cipcode: '51.0801', ciptitle: 'Medical Assistant' },
    calendarLength: 12,
    inDemand: true
  };

  const mockProgramWithoutOutcomes: ResultProps = {
    ...mockProgramWithOutcomes,
    id: '2',
    name: 'Program Without Outcomes',
    outcomes: undefined,
    inDemand: false
  };

  describe('Outcome Data Display', () => {
    it('displays employment rates correctly', () => {
      renderWithContext([mockProgramWithOutcomes]);
      expandTable();
      
      expect(screen.getByText('Employment Rate %')).toBeInTheDocument();
      expect(screen.getByText('84.6% Employed')).toBeInTheDocument();
    });

    it('displays completion rates correctly', () => {
      renderWithContext([mockProgramWithOutcomes]);
      expandTable();
      
      expect(screen.getByText('Completion Rate %')).toBeInTheDocument();
      expect(screen.getByText('61.3% Completed')).toBeInTheDocument();
    });

    it('displays credential rates correctly', () => {
      renderWithContext([mockProgramWithOutcomes]);
      expandTable();
      
      expect(screen.getByText('Credential Rate %')).toBeInTheDocument();
      expect(screen.getByText('0.8% Credentialed')).toBeInTheDocument();
    });

    it('displays average salary correctly', () => {
      renderWithContext([mockProgramWithOutcomes]);
      expandTable();
      
      expect(screen.getByText('Average Salary')).toBeInTheDocument();
      expect(screen.getByText('$48,464')).toBeInTheDocument();
    });
  });

  describe('Data Unreported States', () => {
    it('shows "--" for programs without outcome data', () => {
      renderWithContext([mockProgramWithoutOutcomes]);
      expandTable();
      
      // Should show program info
      expect(screen.getByText('Program Without Outcomes')).toBeInTheDocument();
      
      // Should show "--" for missing outcome data
      const dashElements = screen.getAllByText('--');
      expect(dashElements.length).toBeGreaterThan(0);
    });

    it('handles mixed data availability', () => {
      renderWithContext([mockProgramWithOutcomes, mockProgramWithoutOutcomes]);
      expandTable();
      
      // Should show data for program with outcomes
      expect(screen.getByText('84.6% Employed')).toBeInTheDocument();
      expect(screen.getByText('61.3% Completed')).toBeInTheDocument();
      
      // Should show "--" for program without outcomes
      const dashElements = screen.getAllByText('--');
      expect(dashElements.length).toBeGreaterThan(0);
    });
  });

  describe('Formatting Consistency', () => {
    it('formats percentages with one decimal place', () => {
      renderWithContext([mockProgramWithOutcomes]);
      expandTable();
      
      expect(screen.getByText('84.6% Employed')).toBeInTheDocument();
      expect(screen.getByText('61.3% Completed')).toBeInTheDocument();
      expect(screen.getByText('0.8% Credentialed')).toBeInTheDocument();
    });

    it('formats currency without decimal places', () => {
      renderWithContext([mockProgramWithOutcomes]);
      expandTable();
      
      expect(screen.getByText('$48,464')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders table structure correctly', () => {
      renderWithContext([mockProgramWithOutcomes]);
      expandTable();
      
      expect(screen.getByRole('table')).toBeInTheDocument();
      
      // Check for outcome-related row headers
      expect(screen.getByText('Employment Rate %')).toBeInTheDocument();
      expect(screen.getByText('Completion Rate %')).toBeInTheDocument();
      expect(screen.getByText('Credential Rate %')).toBeInTheDocument();
      expect(screen.getByText('Average Salary')).toBeInTheDocument();
    });

    it('handles empty compare list', () => {
      renderWithContext([]);
      expandTable();
      
      // Should not crash and should render table structure
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles programs with zero values', () => {
      const zeroValuesProgram: ResultProps = {
        ...mockProgramWithOutcomes,
        outcomes: {
          completion: { completionRate: 0 },
          employment: [{ quarter: 2, employmentRate: 0, medianAnnualSalary: 0 }]
        }
      };

      renderWithContext([zeroValuesProgram]);
      expandTable();
      
      expect(screen.getByText('0.0% Employed')).toBeInTheDocument();
      expect(screen.getByText('0.0% Completed')).toBeInTheDocument();
      expect(screen.getByText('$0')).toBeInTheDocument();
    });

    it('handles programs with high values', () => {
      const highValuesProgram: ResultProps = {
        ...mockProgramWithOutcomes,
        outcomes: {
          completion: { completionRate: 1.0 },
          employment: [{ quarter: 2, employmentRate: 100, medianAnnualSalary: 150000 }]
        }
      };

      renderWithContext([highValuesProgram]);
      expandTable();
      
      expect(screen.getByText('100.0% Employed')).toBeInTheDocument();
      expect(screen.getByText('100.0% Completed')).toBeInTheDocument();
      expect(screen.getByText('$150,000')).toBeInTheDocument();
    });
  });
});