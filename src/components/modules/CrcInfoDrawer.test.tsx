import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CrcInfoDrawer } from './CrcInfoDrawer';

// Mock the Drawer component
jest.mock('./Drawer', () => ({
  Drawer: ({ children, title, open }: { children: React.ReactNode; title?: string; open: boolean }) => (
    <div data-testid="drawer" data-title={title} data-open={open}>
      {children}
    </div>
  )
}));

// Mock the Heading component
jest.mock('./Heading', () => ({
  Heading: ({ children, level }: { children: React.ReactNode; level: number }) => (
    <div data-testid={`heading-${level}`} role="heading">
      {children}
    </div>
  )
}));

describe('CrcInfoDrawer', () => {
  const mockProps = {
    crcInfoDrawerOpen: true,
    setCrcInfoDrawerOpen: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<CrcInfoDrawer {...mockProps} />);
    
    expect(screen.getByTestId('drawer')).toBeInTheDocument();
    expect(screen.getByTestId('heading-3')).toBeInTheDocument();
    expect(screen.getByText('About the Consumer Report Card')).toBeInTheDocument();
  });

  it('passes correct props to Drawer', () => {
    render(<CrcInfoDrawer {...mockProps} />);
    
    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveAttribute('data-title', 'Consumer Report Card');
    expect(drawer).toHaveAttribute('data-open', 'true');
  });

  it('renders all metric explanations', () => {
    render(<CrcInfoDrawer {...mockProps} />);
    
    expect(screen.getByText('Percent of employed graduates')).toBeInTheDocument();
    expect(screen.getByText('Median wage')).toBeInTheDocument();
    expect(screen.getByText('Completion percentage')).toBeInTheDocument();
    expect(screen.getByText('Top three industries for completers')).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(<CrcInfoDrawer {...mockProps} />);
    
    expect(screen.getByText('Have a question about the data?')).toBeInTheDocument();
    expect(screen.getByText('Contact our team')).toBeInTheDocument();
  });

  it('renders legal compliance note', () => {
    render(<CrcInfoDrawer {...mockProps} />);
    
    expect(screen.getByText(/New Jersey State law/)).toBeInTheDocument();
  });
});