import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CrcInfoDrawer } from './CrcInfoDrawer';

describe('CrcInfoDrawer', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders when open', () => {
    render(<CrcInfoDrawer isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('About Consumer Report Cards')).toBeInTheDocument();
    expect(screen.getByText(/Consumer Report Cards provide transparent information/)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<CrcInfoDrawer isOpen={false} onClose={mockOnClose} />);
    
    expect(screen.queryByText('About Consumer Report Cards')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<CrcInfoDrawer isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('contains the expected content sections', () => {
    render(<CrcInfoDrawer isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('About Consumer Report Cards')).toBeInTheDocument();
    expect(screen.getByText(/Consumer Report Cards provide transparent information/)).toBeInTheDocument();
    expect(screen.getByText('Completion Percentage')).toBeInTheDocument();
    expect(screen.getByText('Employment Rate')).toBeInTheDocument();
    expect(screen.getByText('Median Wage')).toBeInTheDocument();
    expect(screen.getByText('Top Industries')).toBeInTheDocument();
  });
});