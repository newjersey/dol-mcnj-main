import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { PathwayProvider, usePathway } from './pathway-provider';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Test component that uses the usePathway hook
const TestComponent: React.FC = () => {
  const { getPathway } = usePathway();
  const [result, setResult] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleGetPathway = async () => {
    try {
      const data = await getPathway('9', 'filter=healthcare&region=north');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div>
      <button onClick={handleGetPathway}>Get Pathway</button>
      {result && <div data-testid="result">{JSON.stringify(result)}</div>}
      {error && <div data-testid="error">{error}</div>}
    </div>
  );
};

describe('PathwayProvider', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should provide getPathway function through context', async () => {
    const mockData = {
      id: '9',
      title: 'Test Pathway',
      description: 'Test Description'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    } as Response);

    render(
      <PathwayProvider>
        <TestComponent />
      </PathwayProvider>
    );

    const button = screen.getByText('Get Pathway');
    button.click();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/pathway/9?filter=healthcare&region=north');
      expect(screen.getByTestId('result')).toHaveTextContent(JSON.stringify(mockData));
    });
  });

  it('should handle API calls without query string', async () => {
    const mockData = { id: '9', title: 'Test Pathway' };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    } as Response);

    const TestComponentNoQuery: React.FC = () => {
      const { getPathway } = usePathway();
      const [result, setResult] = React.useState<any>(null);

      const handleGetPathway = async () => {
        const data = await getPathway('9');
        setResult(data);
      };

      return (
        <div>
          <button onClick={handleGetPathway}>Get Pathway</button>
          {result && <div data-testid="result">{JSON.stringify(result)}</div>}
        </div>
      );
    };

    render(
      <PathwayProvider>
        <TestComponentNoQuery />
      </PathwayProvider>
    );

    const button = screen.getByText('Get Pathway');
    button.click();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/pathway/9');
    });
  });

  it('should handle fetch errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found'
    } as Response);

    render(
      <PathwayProvider>
        <TestComponent />
      </PathwayProvider>
    );

    const button = screen.getByText('Get Pathway');
    button.click();

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch pathway: Not Found');
    });
  });

  it('should throw error when usePathway is used outside provider', () => {
    const TestComponentOutsideProvider: React.FC = () => {
      usePathway();
      return <div>Test</div>;
    };

    expect(() => render(<TestComponentOutsideProvider />)).toThrow(
      'usePathway must be used within a PathwayProvider'
    );
  });
});