describe('Enhanced Search and Pagination Flow', () => {
  beforeEach(() => {
    // Mock the Credential Engine API responses
    cy.intercept('POST', '/api/search', {
      fixture: 'search-results.json'
    }).as('searchRequest');

    cy.intercept('GET', '/api/training/ce-*', {
      fixture: 'training-detail.json'
    }).as('trainingDetail');

    cy.visit('/search');
  });

  describe('Search functionality', () => {
    it('should perform basic search and display results', () => {
      // Enter search query
      cy.get('[data-testid="search-input"]').type('nursing');
      cy.get('[data-testid="search-button"]').click();

      // Wait for API call
      cy.wait('@searchRequest');

      // Verify results are displayed
      cy.get('[data-testid="search-results"]').should('be.visible');
      cy.get('[data-testid="training-card"]').should('have.length.at.least', 1);
      cy.get('[data-testid="results-count"]').should('contain', 'training');
    });

    it('should handle empty search results', () => {
      cy.intercept('POST', '/api/search', {
        body: {
          trainings: [],
          totalResults: 0,
          currentPage: 1,
          totalPages: 0,
          pageSize: 10
        }
      }).as('emptySearchRequest');

      cy.get('[data-testid="search-input"]').type('nonexistent program');
      cy.get('[data-testid="search-button"]').click();

      cy.wait('@emptySearchRequest');
      cy.get('[data-testid="no-results-message"]').should('be.visible');
      cy.get('[data-testid="no-results-message"]').should('contain', 'No training programs found');
    });

    it('should maintain search state on page refresh', () => {
      cy.get('[data-testid="search-input"]').type('nursing');
      cy.get('[data-testid="search-button"]').click();
      cy.wait('@searchRequest');

      // Refresh the page
      cy.reload();

      // Verify search results are still displayed
      cy.get('[data-testid="search-results"]').should('be.visible');
      cy.get('[data-testid="search-input"]').should('have.value', 'nursing');
    });
  });

  describe('Filtering functionality', () => {
    beforeEach(() => {
      cy.get('[data-testid="search-input"]').type('nursing');
      cy.get('[data-testid="search-button"]').click();
      cy.wait('@searchRequest');
    });

    it('should filter by delivery mode', () => {
      cy.get('[data-testid="delivery-mode-filter"]').select('online');
      cy.wait('@searchRequest');

      // Verify filter is applied
      cy.get('[data-testid="active-filters"]').should('contain', 'Online');
      cy.get('[data-testid="training-card"]').each($card => {
        cy.wrap($card).should('contain', 'Online Available');
      });
    });

    it('should filter by cost range', () => {
      cy.get('[data-testid="cost-range-filter"]').select('1000-5000');
      cy.wait('@searchRequest');

      // Verify filter is applied
      cy.get('[data-testid="active-filters"]').should('contain', '$1,000 - $5,000');
    });

    it('should filter by distance with zipcode', () => {
      cy.get('[data-testid="zipcode-input"]').type('08701');
      cy.get('[data-testid="distance-filter"]').select('25');
      cy.wait('@searchRequest');

      // Verify filter is applied
      cy.get('[data-testid="active-filters"]').should('contain', 'Within 25 miles');
      cy.get('[data-testid="active-filters"]').should('contain', '08701');
    });

    it('should apply multiple filters simultaneously', () => {
      cy.get('[data-testid="delivery-mode-filter"]').select('hybrid');
      cy.get('[data-testid="cost-range-filter"]').select('2000-8000');
      cy.get('[data-testid="zipcode-input"]').type('07102');
      cy.get('[data-testid="distance-filter"]').select('50');

      cy.wait('@searchRequest');

      // Verify all filters are applied
      cy.get('[data-testid="active-filters"]').should('contain', 'Hybrid');
      cy.get('[data-testid="active-filters"]').should('contain', '$2,000 - $8,000');
      cy.get('[data-testid="active-filters"]').should('contain', 'Within 50 miles');
      cy.get('[data-testid="active-filters"]').should('contain', '07102');
    });

    it('should clear all filters', () => {
      // Apply some filters
      cy.get('[data-testid="delivery-mode-filter"]').select('online');
      cy.get('[data-testid="cost-range-filter"]').select('1000-5000');
      cy.wait('@searchRequest');

      // Clear filters
      cy.get('[data-testid="clear-filters-button"]').click();
      cy.wait('@searchRequest');

      // Verify filters are cleared
      cy.get('[data-testid="active-filters"]').should('not.exist');
      cy.get('[data-testid="delivery-mode-filter"]').should('have.value', '');
      cy.get('[data-testid="cost-range-filter"]').should('have.value', '');
    });

    it('should validate zipcode format', () => {
      cy.get('[data-testid="zipcode-input"]').type('invalid');
      cy.get('[data-testid="distance-filter"]').select('25');

      // Should show validation error
      cy.get('[data-testid="zipcode-error"]').should('be.visible');
      cy.get('[data-testid="zipcode-error"]').should('contain', 'Please enter a valid ZIP code');
    });
  });

  describe('Pagination functionality', () => {
    beforeEach(() => {
      // Mock response with multiple pages
      cy.intercept('POST', '/api/search', {
        body: {
          trainings: Array.from({ length: 10 }, (_, i) => ({
            ctid: `ce-${i}`,
            name: { 'en-US': `Training Program ${i + 1}` },
            description: { 'en-US': 'Test description' },
            providerName: 'Test Provider'
          })),
          totalResults: 25,
          currentPage: 1,
          totalPages: 3,
          pageSize: 10
        }
      }).as('paginatedSearchRequest');

      cy.get('[data-testid="search-input"]').type('nursing');
      cy.get('[data-testid="search-button"]').click();
      cy.wait('@paginatedSearchRequest');
    });

    it('should display pagination controls', () => {
      cy.get('[data-testid="pagination"]').should('be.visible');
      cy.get('[data-testid="page-info"]').should('contain', 'Page 1 of 3');
      cy.get('[data-testid="next-page-button"]').should('be.enabled');
      cy.get('[data-testid="previous-page-button"]').should('be.disabled');
    });

    it('should navigate to next page', () => {
      cy.intercept('POST', '/api/search', {
        body: {
          trainings: Array.from({ length: 10 }, (_, i) => ({
            ctid: `ce-${i + 10}`,
            name: { 'en-US': `Training Program ${i + 11}` },
            description: { 'en-US': 'Test description' },
            providerName: 'Test Provider'
          })),
          totalResults: 25,
          currentPage: 2,
          totalPages: 3,
          pageSize: 10
        }
      }).as('page2Request');

      cy.get('[data-testid="next-page-button"]').click();
      cy.wait('@page2Request');

      cy.get('[data-testid="page-info"]').should('contain', 'Page 2 of 3');
      cy.get('[data-testid="previous-page-button"]').should('be.enabled');
    });

    it('should navigate to specific page', () => {
      cy.intercept('POST', '/api/search', {
        body: {
          trainings: Array.from({ length: 5 }, (_, i) => ({
            ctid: `ce-${i + 20}`,
            name: { 'en-US': `Training Program ${i + 21}` },
            description: { 'en-US': 'Test description' },
            providerName: 'Test Provider'
          })),
          totalResults: 25,
          currentPage: 3,
          totalPages: 3,
          pageSize: 10
        }
      }).as('page3Request');

      cy.get('[data-testid="page-number-3"]').click();
      cy.wait('@page3Request');

      cy.get('[data-testid="page-info"]').should('contain', 'Page 3 of 3');
      cy.get('[data-testid="next-page-button"]').should('be.disabled');
    });

    it('should change page size', () => {
      cy.intercept('POST', '/api/search', {
        body: {
          trainings: Array.from({ length: 20 }, (_, i) => ({
            ctid: `ce-${i}`,
            name: { 'en-US': `Training Program ${i + 1}` },
            description: { 'en-US': 'Test description' },
            providerName: 'Test Provider'
          })),
          totalResults: 25,
          currentPage: 1,
          totalPages: 2,
          pageSize: 20
        }
      }).as('pageSizeRequest');

      cy.get('[data-testid="page-size-select"]').select('20');
      cy.wait('@pageSizeRequest');

      cy.get('[data-testid="training-card"]').should('have.length', 20);
      cy.get('[data-testid="page-info"]').should('contain', 'Page 1 of 2');
    });

    it('should maintain filters across page navigation', () => {
      // Apply a filter
      cy.get('[data-testid="delivery-mode-filter"]').select('online');
      cy.wait('@paginatedSearchRequest');

      // Navigate to next page
      cy.get('[data-testid="next-page-button"]').click();
      cy.wait('@paginatedSearchRequest');

      // Verify filter is still applied
      cy.get('[data-testid="delivery-mode-filter"]').should('have.value', 'online');
      cy.get('[data-testid="active-filters"]').should('contain', 'Online');
    });
  });

  describe('Error handling', () => {
    it('should display error message on search failure', () => {
      cy.intercept('POST', '/api/search', {
        statusCode: 500,
        body: { error: 'Search service temporarily unavailable' }
      }).as('failedSearchRequest');

      cy.get('[data-testid="search-input"]').type('nursing');
      cy.get('[data-testid="search-button"]').click();
      cy.wait('@failedSearchRequest');

      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="error-message"]').should('contain', 'Search service temporarily unavailable');
    });

    it('should retry search after error', () => {
      cy.intercept('POST', '/api/search', {
        statusCode: 500,
        body: { error: 'Network error' }
      }).as('failedSearchRequest');

      cy.get('[data-testid="search-input"]').type('nursing');
      cy.get('[data-testid="search-button"]').click();
      cy.wait('@failedSearchRequest');

      // Mock successful retry
      cy.intercept('POST', '/api/search', {
        fixture: 'search-results.json'
      }).as('retrySearchRequest');

      cy.get('[data-testid="retry-button"]').click();
      cy.wait('@retrySearchRequest');

      cy.get('[data-testid="search-results"]').should('be.visible');
      cy.get('[data-testid="error-message"]').should('not.exist');
    });

    it('should handle network connectivity issues', () => {
      cy.intercept('POST', '/api/search', { forceNetworkError: true }).as('networkError');

      cy.get('[data-testid="search-input"]').type('nursing');
      cy.get('[data-testid="search-button"]').click();
      cy.wait('@networkError');

      cy.get('[data-testid="error-message"]').should('contain', 'network');
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });
  });

  describe('Training detail navigation', () => {
    beforeEach(() => {
      cy.get('[data-testid="search-input"]').type('nursing');
      cy.get('[data-testid="search-button"]').click();
      cy.wait('@searchRequest');
    });

    it('should navigate to training detail page', () => {
      cy.get('[data-testid="training-card"]').first().within(() => {
        cy.get('[data-testid="view-details-button"]').click();
      });

      cy.wait('@trainingDetail');
      cy.url().should('include', '/training/');
      cy.get('[data-testid="training-detail"]').should('be.visible');
    });

    it('should return to search results with back navigation', () => {
      cy.get('[data-testid="training-card"]').first().within(() => {
        cy.get('[data-testid="view-details-button"]').click();
      });

      cy.wait('@trainingDetail');
      cy.get('[data-testid="back-to-search"]').click();

      // Should return to search results with state preserved
      cy.get('[data-testid="search-results"]').should('be.visible');
      cy.get('[data-testid="search-input"]').should('have.value', 'nursing');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      cy.get('[data-testid="search-input"]').type('nursing');
      cy.get('[data-testid="search-button"]').click();
      cy.wait('@searchRequest');
    });

    it('should support keyboard navigation', () => {
      // Tab through search elements
      cy.get('[data-testid="search-input"]').focus().tab();
      cy.get('[data-testid="delivery-mode-filter"]').should('have.focus');
      
      cy.tab();
      cy.get('[data-testid="cost-range-filter"]').should('have.focus');
      
      cy.tab();
      cy.get('[data-testid="zipcode-input"]').should('have.focus');
    });

    it('should have proper ARIA labels and roles', () => {
      cy.get('[data-testid="search-results"]').should('have.attr', 'role', 'main');
      cy.get('[data-testid="delivery-mode-filter"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="pagination"]').should('have.attr', 'role', 'navigation');
    });

    it('should announce search results to screen readers', () => {
      cy.get('[data-testid="results-announcement"]').should('have.attr', 'aria-live', 'polite');
      cy.get('[data-testid="results-announcement"]').should('contain', 'found');
    });
  });

  describe('Performance', () => {
    it('should load search results within acceptable time', () => {
      const startTime = Date.now();
      
      cy.get('[data-testid="search-input"]').type('nursing');
      cy.get('[data-testid="search-button"]').click();
      cy.wait('@searchRequest');
      
      cy.get('[data-testid="search-results"]').should('be.visible').then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(3000); // 3 seconds
      });
    });

    it('should debounce filter changes', () => {
      let requestCount = 0;
      cy.intercept('POST', '/api/search', req => {
        requestCount++;
        req.reply({ fixture: 'search-results.json' });
      }).as('debounceTest');

      cy.get('[data-testid="search-input"]').type('nursing');
      cy.get('[data-testid="search-button"]').click();
      cy.wait('@debounceTest');

      // Rapidly change filters
      cy.get('[data-testid="delivery-mode-filter"]').select('online');
      cy.get('[data-testid="cost-range-filter"]').select('1000-5000');
      cy.get('[data-testid="distance-filter"]').select('25');

      // Should debounce and not make excessive requests
      cy.wait(1000).then(() => {
        expect(requestCount).to.be.lessThan(5);
      });
    });
  });
});
