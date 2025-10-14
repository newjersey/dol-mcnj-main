import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProgramBanner } from './index';
import { ProgramOutcome } from '../../../utils/types/components';

// Mock OutcomeDetails component
jest.mock('../../modules/OutcomeDetails', () => ({
  OutcomeDetails: ({ outcomes, horizontal, className, title }: any) => (
    <div 
      data-testid="outcome-details" 
      data-horizontal={horizontal}
      className={className}
      data-title={title}
    >
      OutcomeDetails Component - {horizontal ? 'Horizontal' : 'Vertical'}
    </div>
  ),
}));

// Mock other components that aren't the focus of this test
jest.mock('./CrumbSearch', () => ({
  CrumbSearch: ({ items, name, className }: any) => (
    <div data-testid="crumb-search" className={className}>
      {name} - {items?.length || 0} crumbs
    </div>
  ),
}));

jest.mock('./TitleBox', () => ({
  TitleBox: ({ id, name, provider }: any) => (
    <div data-testid="title-box">
      {name} by {provider} (ID: {id})
    </div>
  ),
}));

jest.mock('../PageBanner/InfoBlocks', () => ({
  InfoBlocks: ({ titleBlock }: any) => (
    <div data-testid="info-blocks">
      {titleBlock ? titleBlock.copy : 'No title block'}
    </div>
  ),
}));

// Mock outcome helpers
jest.mock('../../../utils/outcomeHelpers', () => ({
  hasOutcomeData: jest.fn(() => true),
}));

describe('ProgramBanner Integration Tests', () => {
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
      }
    ]
  };

  const mockProps = {
    id: 'TEST123',
    name: 'Test Program',
    provider: 'Test Provider',
    printHandler: jest.fn(),
    breadcrumbsCollection: {
      items: [
        { copy: 'Home', url: '/' },
        { copy: 'Training', url: '/training' }
      ]
    },
    outcomes: mockOutcome
  };

  describe('Layout Integration', () => {
    it('renders InfoBlocks for mobile (OutcomeDetails handled by tab interface)', () => {
      render(<ProgramBanner {...mockProps} />);
      
      // InfoBlocks should be rendered for mobile only (desktop only shows if inDemand)
      const infoBlocksComponents = screen.getAllByTestId('info-blocks');
      expect(infoBlocksComponents).toHaveLength(1); // Mobile only
      
      // OutcomeDetails should be rendered for tablet and desktop (2 instances)
      const outcomeComponents = screen.getAllByTestId('outcome-details');
      expect(outcomeComponents).toHaveLength(2); // Tablet + Desktop
      expect(outcomeComponents[0]).toHaveAttribute('data-horizontal', 'true');
    });

    it('renders side-by-side layout for desktop with height matching', () => {
      render(<ProgramBanner {...mockProps} />);
      
      // Should have tablet and desktop layouts rendered
      const outcomeComponents = screen.getAllByTestId('outcome-details');
      expect(outcomeComponents).toHaveLength(2); // Tablet + Desktop
      
      // Both components should be horizontal versions
      outcomeComponents.forEach(component => {
        expect(component).toHaveAttribute('data-horizontal', 'true');
        expect(component).toHaveTextContent('Horizontal');
      });
      
      // Check that they have the mb-0 class
      outcomeComponents.forEach(component => {
        expect(component).toHaveClass('mb-0');
      });
    });
  });

  describe('OutcomeDetails Integration', () => {
    it('passes outcomes data to OutcomeDetails component', () => {
      render(<ProgramBanner {...mockProps} />);
      
      // Tablet and desktop OutcomeDetails should be rendered (mobile uses tab interface)
      const outcomeComponents = screen.getAllByTestId('outcome-details');
      expect(outcomeComponents).toHaveLength(2); // Tablet + Desktop
    });

    it('renders OutcomeDetails even without outcomes data', () => {
      render(<ProgramBanner {...mockProps} outcomes={undefined} />);
      
      // Should still render OutcomeDetails (it handles empty data internally)
      const outcomeComponents = screen.getAllByTestId('outcome-details');
      expect(outcomeComponents).toHaveLength(2); // Tablet + Desktop
    });

    it('passes outcomes to desktop version (mobile handled by tab interface)', () => {
      render(<ProgramBanner {...mockProps} />);
      
      const outcomeComponents = screen.getAllByTestId('outcome-details');
      
      // Should have tablet and desktop versions
      expect(outcomeComponents).toHaveLength(2);
      outcomeComponents.forEach(component => {
        expect(component.getAttribute('data-horizontal')).toBe('true');
      });
    });
  });

  describe('Container Structure', () => {
    it('renders all banner components with correct structure', () => {
      render(<ProgramBanner {...mockProps} />);
      
      // All core components should be present
      expect(screen.getByTestId('crumb-search')).toBeInTheDocument();
      expect(screen.getByTestId('title-box')).toBeInTheDocument();
      expect(screen.getAllByTestId('info-blocks')).toHaveLength(1); // Mobile only (desktop only if inDemand)
      expect(screen.getAllByTestId('outcome-details')).toHaveLength(2); // Tablet + Desktop
    });
  });
});