import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PathwayRelatedContent } from './pathway-related-content';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock URLSearchParams
const mockURLSearchParams = jest.fn();
global.URLSearchParams = mockURLSearchParams as any;

describe('PathwayRelatedContent', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockURLSearchParams.mockClear();
  });

  it('should include query parameters in API call', async () => {
    // Mock URLSearchParams to return query parameters
    mockURLSearchParams.mockImplementation(() => ({
      toString: () => 'filter=healthcare&region=north'
    }));

    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        relatedContent: [
          {
            id: '1',
            title: 'Test Content',
            description: 'Test Description',
            url: 'https://example.com'
          }
        ]
      })
    } as Response);

    render(<PathwayRelatedContent pathwayId="9" />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/pathway/9/related?filter=healthcare&region=north'
      );
    });
  });

  it('should render related content correctly', async () => {
    // Mock URLSearchParams to return query parameters
    mockURLSearchParams.mockImplementation(() => ({
      toString: () => 'filter=healthcare&region=north'
    }));

    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        relatedContent: [
          {
            id: '1',
            title: 'Healthcare Training',
            description: 'Training opportunities in healthcare',
            url: 'https://example.com/healthcare'
          }
        ]
      })
    } as Response);

    render(<PathwayRelatedContent pathwayId="9" />);

    await waitFor(() => {
      expect(screen.getByText('Related Content')).toBeInTheDocument();
      expect(screen.getByText('Healthcare Training')).toBeInTheDocument();
      expect(screen.getByText('Training opportunities in healthcare')).toBeInTheDocument();
    });
  });

  it('should handle empty query parameters', async () => {
    // Mock URLSearchParams to return empty string
    mockURLSearchParams.mockImplementation(() => ({
      toString: () => ''
    }));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        relatedContent: []
      })
    } as Response);

    render(<PathwayRelatedContent pathwayId="9" />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/pathway/9/related');
    });
  });

  it('should handle API errors gracefully', async () => {
    // Mock URLSearchParams
    mockURLSearchParams.mockImplementation(() => ({
      toString: () => ''
    }));

    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error'
    } as Response);

    render(<PathwayRelatedContent pathwayId="9" />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});