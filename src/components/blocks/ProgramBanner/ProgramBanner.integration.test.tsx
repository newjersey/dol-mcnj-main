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
      
      // InfoBlocks should be rendered for both mobile and desktop
      const infoBlocksComponents = screen.getAllByTestId('info-blocks');
      expect(infoBlocksComponents).toHaveLength(2); // Mobile + Desktop
      
      // OutcomeDetails should only be rendered for desktop (mobile uses tab interface)
      const outcomeComponents = screen.getAllByTestId('outcome-details');
      expect(outcomeComponents).toHaveLength(1); // Only desktop
      expect(outcomeComponents[0]).toHaveAttribute('data-horizontal', 'true');
    });

    it('renders side-by-side layout for desktop with height matching', () => {
      render(<ProgramBanner {...mockProps} />);
      
      // Should have only desktop layout rendered (mobile uses tab interface)
      const outcomeComponents = screen.getAllByTestId('outcome-details');
      expect(outcomeComponents).toHaveLength(1);
      
      // The single component should be the horizontal (desktop) version
      const desktopOutcomes = outcomeComponents[0];
      expect(desktopOutcomes).toHaveAttribute('data-horizontal', 'true');
      expect(desktopOutcomes).toHaveTextContent('Horizontal');
      
      // Check that it has height matching classes
      expect(desktopOutcomes).toHaveClass('mb-0', 'h-full');
    });
  });

  describe('OutcomeDetails Integration', () => {
    it('passes outcomes data to OutcomeDetails component', () => {
      render(<ProgramBanner {...mockProps} />);
      
      // Only desktop OutcomeDetails should be rendered (mobile uses tab interface)
      const outcomeComponents = screen.getAllByTestId('outcome-details');
      expect(outcomeComponents).toHaveLength(1);
    });

    it('renders OutcomeDetails even without outcomes data', () => {
      render(<ProgramBanner {...mockProps} outcomes={undefined} />);
      
      // Should still render OutcomeDetails (it handles empty data internally)
      const outcomeComponents = screen.getAllByTestId('outcome-details');
      expect(outcomeComponents).toHaveLength(1); // Only desktop
    });

    it('passes outcomes to desktop version (mobile handled by tab interface)', () => {
      render(<ProgramBanner {...mockProps} />);
      
      const outcomeComponents = screen.getAllByTestId('outcome-details');
      
      // Should have only desktop version
      expect(outcomeComponents).toHaveLength(1);
      expect(outcomeComponents[0].getAttribute('data-horizontal')).toBe('true');
    });
  });

  describe('Container Structure', () => {
    it('renders all banner components with correct structure', () => {
      render(<ProgramBanner {...mockProps} />);
      
      // All core components should be present
      expect(screen.getByTestId('crumb-search')).toBeInTheDocument();
      expect(screen.getByTestId('title-box')).toBeInTheDocument();
      expect(screen.getAllByTestId('info-blocks')).toHaveLength(2); // Mobile + Desktop
      expect(screen.getAllByTestId('outcome-details')).toHaveLength(1); // Desktop only
    });
  });
});