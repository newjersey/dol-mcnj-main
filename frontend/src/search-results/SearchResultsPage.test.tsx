import React from 'react';
import { SearchResultsPage } from './SearchResultsPage';
import { Client } from '../domain/Client';

// Mock the Client
const mockClient = {
  getTrainingsByQuery: jest.fn(),
} as unknown as Client;

// Simple smoke test to verify the component can be imported and instantiated
describe('SearchResultsPage', () => {
  it('should be defined and importable', () => {
    expect(SearchResultsPage).toBeDefined();
    expect(typeof SearchResultsPage).toBe('function');
  });

  it('should accept required props without crashing', () => {
    // This test just verifies the component accepts the right props
    // More complex rendering tests would require extensive mocking
    const props = {
      client: mockClient
    };
    
    expect(() => {
      // We're not actually rendering here, just checking the props are accepted
      const element = React.createElement(SearchResultsPage, props);
      expect(element).toBeDefined();
    }).not.toThrow();
  });
});
