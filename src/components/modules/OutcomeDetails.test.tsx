import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OutcomeDetails } from './OutcomeDetails';
import { ProgramOutcome } from '../../utils/types/components';

// Mock the environment variable
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

const mockOutcome: ProgramOutcome = {
  completion: {
    exiters: 400,
    completers: 245,
    completionRate: "0.6125",
    credentialRate: "61.25"
  },
  employment: [
    {
      quarter: 2,
      employedCount: 347,
      employmentRate: "84.6341463414634",
      medianAnnualSalary: "48463.92",
      naicsIndustries: [
        {
          code: "623110",
          title: "Nursing Care Facilities (Skilled Nursing Facilities)",
          rank: 1
        },
        {
          code: "622110", 
          title: "General Medical and Surgical Hospitals",
          rank: 2
        }
      ]
    },
    {
      quarter: 4,
      employedCount: 202,
      employmentRate: "49.2682926829268",
      medianAnnualSalary: "50133",
      naicsIndustries: [
        {
          code: "623110",
          title: "Nursing Care Facilities (Skilled Nursing Facilities)",
          rank: 1
        }
      ]
    }
  ]
};

describe('OutcomeDetails', () => {
  it('renders with outcome data', () => {
    render(<OutcomeDetails outcomes={mockOutcome} />);
    
    expect(screen.getByText('Consumer report card')).toBeInTheDocument();
    expect(screen.getByText('Completion percentage')).toBeInTheDocument();
    expect(screen.getByText('Percent of employed graduates')).toBeInTheDocument();
    expect(screen.getByText('Median wage')).toBeInTheDocument();
    expect(screen.getByText('Top three industries for completers')).toBeInTheDocument();
  });

  it('displays completion rate correctly', () => {
    render(<OutcomeDetails outcomes={mockOutcome} />);
    
    expect(screen.getByText('61%')).toBeInTheDocument();
  });

  it('displays employment rates correctly', () => {
    render(<OutcomeDetails outcomes={mockOutcome} />);
    
    expect(screen.getByText('85%')).toBeInTheDocument(); // Q2 employment rate
    expect(screen.getByText('49%')).toBeInTheDocument(); // Q4 employment rate
    expect(screen.getAllByText('at 6 months')).toHaveLength(2);
    expect(screen.getAllByText('at 12 months')).toHaveLength(2);
  });

  it('displays salaries correctly', () => {
    render(<OutcomeDetails outcomes={mockOutcome} />);
    
    expect(screen.getByText('$48,464')).toBeInTheDocument(); // Q2 salary 
    expect(screen.getByText('$50,133')).toBeInTheDocument(); // Q4 salary
  });

  it('displays industry information', () => {
    render(<OutcomeDetails outcomes={mockOutcome} />);
    
    expect(screen.getByText('• Nursing Care Facilities (Skilled Nursing Facilities)')).toBeInTheDocument();
    expect(screen.getByText('• General Medical and Surgical Hospitals')).toBeInTheDocument();
  });

  it('does not render when no outcome data exists', () => {
    const { container } = render(<OutcomeDetails outcomes={undefined} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('shows CRC info button when feature flag is enabled', () => {
    process.env.NEXT_PUBLIC_FEATURE_CRC_INFO = 'true';
    const mockOnInfoClick = jest.fn();
    
    render(<OutcomeDetails outcomes={mockOutcome} onInfoClick={mockOnInfoClick} />);
    
    expect(screen.getByText('Learn more about the consumer report card')).toBeInTheDocument();
  });

  it('does not show CRC info button when feature flag is disabled', () => {
    process.env.NEXT_PUBLIC_FEATURE_CRC_INFO = 'false';
    const mockOnInfoClick = jest.fn();
    
    render(<OutcomeDetails outcomes={mockOutcome} onInfoClick={mockOnInfoClick} />);
    
    expect(screen.queryByText('Learn more about the consumer report card')).not.toBeInTheDocument();
  });

  it('accepts custom title and className', () => {
    render(<OutcomeDetails outcomes={mockOutcome} title="Custom Title" className="custom-class" />);
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(document.querySelector('.custom-class')).toBeInTheDocument();
  });
});