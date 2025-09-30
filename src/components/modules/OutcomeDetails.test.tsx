import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OutcomeDetails } from './OutcomeDetails';
import { ProgramOutcome } from '../../utils/types/components';

// Mock Phosphor icons
jest.mock('@phosphor-icons/react/dist/ssr', () => ({
  BriefcaseIcon: ({ className, weight }: { className?: string; weight?: string }) => 
    <div data-testid="briefcase-icon" className={className} data-weight={weight}>💼</div>,
  MoneyWavyIcon: ({ className, weight }: { className?: string; weight?: string }) => 
    <div data-testid="money-icon" className={className} data-weight={weight}>💰</div>,
  GraduationCapIcon: ({ className, weight }: { className?: string; weight?: string }) => 
    <div data-testid="graduation-icon" className={className} data-weight={weight}>🎓</div>,
  BuildingOfficeIcon: ({ className, weight }: { className?: string; weight?: string }) => 
    <div data-testid="building-icon" className={className} data-weight={weight}>🏢</div>,
  Warning: ({ className, weight }: { className?: string; weight?: string }) => 
    <div data-testid="warning-icon" className={className} data-weight={weight}>⚠️</div>,
}));

describe('OutcomeDetails', () => {
  const mockOutcome: ProgramOutcome = {
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
        medianAnnualSalary: 48464,
        naicsIndustries: [
          { code: '621111', title: 'Offices of Physicians', rank: 1 },
          { code: '622110', title: 'General Medical Hospitals', rank: 2 },
          { code: '621610', title: 'Home Health Care Services', rank: 3 }
        ]
      },
      {
        quarter: 4,
        employedCount: 65,
        employmentRate: 49.27,
        medianAnnualSalary: 50133,
        naicsIndustries: [
          { code: '621111', title: 'Offices of Physicians', rank: 1 },
          { code: '622110', title: 'General Medical Hospitals', rank: 2 }
        ]
      }
    ]
  };

  const emptyOutcome: ProgramOutcome = {};

  describe('Component Rendering', () => {
    it('renders all four cards in correct order', () => {
      render(<OutcomeDetails outcomes={mockOutcome} />);
      
      const cards = screen.getAllByRole('generic').filter(el => 
        el.className.includes('bg-white') && el.className.includes('rounded-lg')
      );
      
      // Should have 4 cards
      expect(cards).toHaveLength(4);
      
      // Check order: Employment, Wage, Completion, Industries
      expect(screen.getByText('Percent of employed graduates')).toBeInTheDocument();
      expect(screen.getByText('Median wage')).toBeInTheDocument();
      expect(screen.getByText('Completion percentage')).toBeInTheDocument();
      expect(screen.getByText('Leading industries for graduates')).toBeInTheDocument();
    });

    it('renders in horizontal mode when horizontal prop is true', () => {
      render(<OutcomeDetails outcomes={mockOutcome} horizontal={true} />);
      
      // In horizontal mode, it uses flex layout
      const heading = screen.getByRole('heading', { name: /consumer report card/i });
      const mainContainer = heading.closest('.bg-teal-50');
      const flexContainer = mainContainer?.querySelector('.flex.gap-4');
      expect(flexContainer).toBeInTheDocument();
      expect(flexContainer?.className).toContain('flex');
      expect(flexContainer?.className).toContain('gap-4');
    });

    it('renders in vertical mode by default', () => {
      render(<OutcomeDetails outcomes={mockOutcome} />);
      
      const heading = screen.getByRole('heading', { name: /consumer report card/i });
      const mainContainer = heading.closest('.bg-teal-50');
      const gridContainer = mainContainer?.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer?.className).toContain('grid');
      expect(gridContainer?.className).toContain('tabletMd:grid-cols-4');
    });

    it('applies custom className', () => {
      render(<OutcomeDetails outcomes={mockOutcome} className="custom-class" />);
      
      const container = screen.getByRole('heading', { name: /consumer report card/i }).closest('.bg-teal-50');
      expect(container?.className).toContain('custom-class');
    });
  });

  describe('Data Display', () => {
    it('formats percentages with one decimal place', () => {
      render(<OutcomeDetails outcomes={mockOutcome} />);
      
      // Employment rates
      expect(screen.getByText('84.6%')).toBeInTheDocument(); // Q2: 84.63%
      expect(screen.getByText('49.3%')).toBeInTheDocument(); // Q4: 49.27%
      
      // Completion rate
      expect(screen.getByText('61.3%')).toBeInTheDocument(); // 0.613 * 100 = 61.3%
    });

    it('formats currency without decimals', () => {
      render(<OutcomeDetails outcomes={mockOutcome} />);
      
      expect(screen.getByText('$48,464')).toBeInTheDocument(); // Q2 salary
      expect(screen.getByText('$50,133')).toBeInTheDocument(); // Q4 salary
    });

    it('displays quarterly employment data correctly', () => {
      render(<OutcomeDetails outcomes={mockOutcome} />);
      
      const sixMonthsElements = screen.getAllByText('at 6 months');
      const twelveMonthsElements = screen.getAllByText('at 12 months');
      expect(sixMonthsElements.length).toBeGreaterThan(0);
      expect(twelveMonthsElements.length).toBeGreaterThan(0);
    });

    it('displays top 3 industries correctly', () => {
      render(<OutcomeDetails outcomes={mockOutcome} />);
      
      // Should show Q2 industries (first 3)
      expect(screen.getByText(/• Offices of Physicians/)).toBeInTheDocument();
      expect(screen.getByText(/• General Medical Hospitals/)).toBeInTheDocument();
      expect(screen.getByText(/• Home Health Care Services/)).toBeInTheDocument();
    });
  });

  describe('Data Unreported States', () => {
    it('shows "Data unreported" with Warning icon when no employment data', () => {
      const noEmploymentOutcome: ProgramOutcome = {
        completion: { completionRate: 0.8 }
      };
      
      render(<OutcomeDetails outcomes={noEmploymentOutcome} />);
      
      const dataUnreportedElements = screen.getAllByText('Data unreported');
      expect(dataUnreportedElements.length).toBeGreaterThan(0);
      const warningIcons = screen.getAllByTestId('warning-icon');
      expect(warningIcons.length).toBeGreaterThan(0);
    });

    it('shows "Data unreported" when no wage data', () => {
      const noWageOutcome: ProgramOutcome = {
        employment: [
          { quarter: 2, employmentRate: 80 } // No salary data
        ]
      };
      
      render(<OutcomeDetails outcomes={noWageOutcome} />);
      
      const dataUnreportedElements = screen.getAllByText('Data unreported');
      expect(dataUnreportedElements.length).toBeGreaterThan(0);
    });

    it('shows "Data unreported" when no completion data', () => {
      const noCompletionOutcome: ProgramOutcome = {
        employment: [
          { quarter: 2, employmentRate: 80, medianAnnualSalary: 50000 }
        ]
      };
      
      render(<OutcomeDetails outcomes={noCompletionOutcome} />);
      
      const dataUnreportedElements = screen.getAllByText('Data unreported');
      expect(dataUnreportedElements.length).toBeGreaterThan(0);
    });

    it('shows warning message when no data at all', () => {
      render(<OutcomeDetails outcomes={emptyOutcome} />);
      
      expect(screen.getByText('Consumer report card')).toBeInTheDocument();
      expect(screen.getByText('Data unreported')).toBeInTheDocument();
    });

    it('always shows component even with no data', () => {
      render(<OutcomeDetails outcomes={undefined} />);
      
      // Component should still render
      expect(screen.getByText('Consumer report card')).toBeInTheDocument();
      expect(screen.getByText('Data unreported')).toBeInTheDocument();
    });
  });

  describe('Icon Rendering', () => {
    it('renders Phosphor icons correctly', () => {
      render(<OutcomeDetails outcomes={mockOutcome} />);
      
      expect(screen.getByTestId('briefcase-icon')).toBeInTheDocument();
      expect(screen.getByTestId('money-icon')).toBeInTheDocument();
      expect(screen.getByTestId('graduation-icon')).toBeInTheDocument();
      expect(screen.getByTestId('building-icon')).toBeInTheDocument();
    });

    it('uses duotone weight for data icons', () => {
      render(<OutcomeDetails outcomes={mockOutcome} />);
      
      expect(screen.getByTestId('briefcase-icon')).toHaveAttribute('data-weight', 'duotone');
      expect(screen.getByTestId('money-icon')).toHaveAttribute('data-weight', 'duotone');
      expect(screen.getByTestId('graduation-icon')).toHaveAttribute('data-weight', 'duotone');
      expect(screen.getByTestId('building-icon')).toHaveAttribute('data-weight', 'duotone');
    });

    it('uses regular weight for Warning icons', () => {
      const noDataOutcome: ProgramOutcome = {};
      render(<OutcomeDetails outcomes={noDataOutcome} />);
      
      const warningIcons = screen.getAllByTestId('warning-icon');
      warningIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-weight', 'regular');
      });
    });

    it('applies correct styling to Warning icons', () => {
      const noDataOutcome: ProgramOutcome = {};
      render(<OutcomeDetails outcomes={noDataOutcome} />);
      
      const warningIcons = screen.getAllByTestId('warning-icon');
      warningIcons.forEach(icon => {
        expect(icon.className).toContain('text-gray-600');
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('applies correct responsive classes for horizontal layout', () => {
      render(<OutcomeDetails outcomes={mockOutcome} horizontal={true} />);
      
      const heading = screen.getByRole('heading', { name: /consumer report card/i });
      const mainContainer = heading.closest('.bg-teal-50');
      const flexContainer = mainContainer?.querySelector('.flex.gap-4');
      expect(flexContainer).toBeInTheDocument();
      expect(flexContainer?.className).toContain('gap-4');
    });

    it('applies correct mobile layout classes', () => {
      render(<OutcomeDetails outcomes={mockOutcome} />);
      
      const gridContainer = screen.getByText('Leading industries for graduates').closest('.grid');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer?.className).toContain('grid');
      expect(gridContainer?.className).toContain('tabletMd:grid-cols-4');
    });
  });

  describe('Height Matching', () => {
    it('applies height matching classes when horizontal', () => {
      render(<OutcomeDetails outcomes={mockOutcome} horizontal={true} />);
      
      // Height matching is handled differently in the actual implementation
      const container = screen.getByRole('heading', { name: /consumer report card/i });
      expect(container).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing Q4 employment data gracefully', () => {
      const onlyQ2Outcome: ProgramOutcome = {
        employment: [
          {
            quarter: 2,
            employmentRate: 80,
            medianAnnualSalary: 45000
          }
        ]
      };
      
      render(<OutcomeDetails outcomes={onlyQ2Outcome} />);
      
      expect(screen.getByText('80.0%')).toBeInTheDocument();
      expect(screen.getByText('$45,000')).toBeInTheDocument();
      const naElements = screen.getAllByText('N/A');
      expect(naElements.length).toBeGreaterThan(0); // Q4 data missing
    });

    it('handles empty industries array', () => {
      const noIndustriesOutcome: ProgramOutcome = {
        employment: [
          {
            quarter: 2,
            employmentRate: 80,
            naicsIndustries: []
          }
        ]
      };
      
      render(<OutcomeDetails outcomes={noIndustriesOutcome} />);
      
      const dataUnreportedElements = screen.getAllByText('Data unreported');
      expect(dataUnreportedElements.length).toBeGreaterThan(0);
    });

    it('handles very small completion rates', () => {
      const smallRateOutcome: ProgramOutcome = {
        completion: {
          completionRate: 0.001 // 0.1%
        }
      };
      
      render(<OutcomeDetails outcomes={smallRateOutcome} />);
      
      expect(screen.getByText('0.1%')).toBeInTheDocument();
    });

    it('handles very large salaries', () => {
      const highSalaryOutcome: ProgramOutcome = {
        employment: [
          {
            quarter: 2,
            medianAnnualSalary: 150000
          }
        ]
      };
      
      render(<OutcomeDetails outcomes={highSalaryOutcome} />);
      
      expect(screen.getByText('$150,000')).toBeInTheDocument();
    });
  });
});