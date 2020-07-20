describe('Filtering', () => {
    it('filters by max cost', () => {
        cy.visit('/search/baker');
        cy.contains('Pastry Arts Academic Credit Certificate').should('exist');

        cy.contains('Max Cost').within(() => {
            cy.get('input').type('5000');
            cy.get('input').blur()
        });

        cy.contains('Pastry Arts Academic Credit Certificate').should('not.exist');

        cy.contains('Max Cost').within(() => {
            cy.get('input').clear()
            cy.get('input').blur()
        });

        cy.contains('Pastry Arts Academic Credit Certificate').should('exist');
    });

    it('preserves a filter between pages', () => {
        cy.visit('/search/baker');
        cy.contains('Pastry Arts Academic Credit Certificate').should('exist');

        cy.contains('Max Cost').within(() => {
            cy.get('input').type('5000');
            cy.get('input').blur()
        });

        cy.contains('Baking for Beginners').click({force: true});
        cy.location('pathname').should('eq', '/training/14654');
        cy.go('back');

        cy.contains('Pastry Arts Academic Credit Certificate').should('not.exist');
        cy.contains('Max Cost').within(() => {
            cy.get('input').should('have.value', '5000')
        });
    });
});