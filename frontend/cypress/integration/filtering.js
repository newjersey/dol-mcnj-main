describe('Filtering', () => {
    it('filters by max cost', () => {
        cy.visit('/search/baker');
        cy.contains('Pastry Arts Academic Credit Certificate').should('exist');
        cy.contains('8 results found for "baker"').should('exist');

        cy.contains('Max Cost').within(() => {
            cy.get('input').type('5000');
            cy.get('input').blur()
        });

        cy.contains('Pastry Arts Academic Credit Certificate').should('not.exist');
        cy.contains('5 results found for "baker"').should('exist');

        cy.contains('Max Cost').within(() => {
            cy.get('input').clear()
            cy.get('input').blur()
        });

        cy.contains('Pastry Arts Academic Credit Certificate').should('exist');
        cy.contains('8 results found for "baker"').should('exist');
    });

    it('filters by employment outcomes', () => {
        cy.visit('/search/baker');
        cy.contains('Baking and Pastry Arts').should('exist');
        cy.contains('8 results found for "baker"').should('exist');


        cy.contains('Employment Rate').within(() => {
            cy.get('[type="checkbox"][name="best"]').check()
        });

        cy.contains('Baking and Pastry Arts').should('not.exist');
        cy.contains('0 results found for "baker"').should('exist');

        cy.contains('Employment Rate').within(() => {
            cy.get('[type="checkbox"][name="medium"]').check()
        });

        cy.contains('Baking and Pastry Arts').should('exist');
        cy.contains('2 results found for "baker"').should('exist');

    });

    it('filters by training length', () => {
        cy.visit('/search/baker');
        cy.contains('Baking and Pastry Arts').should('exist');
        cy.contains('8 results found for "baker"').should('exist');


        cy.contains('Time to Complete').within(() => {
            cy.get('[type="checkbox"][name="days"]').check()
        });

        cy.contains('Baking for Beginners').should('not.exist');
        cy.contains('0 results found for "baker"').should('exist');

        cy.contains('Time to Complete').within(() => {
            cy.get('[type="checkbox"][name="weeks"]').check()
        });

        cy.contains('Baking for Beginners').should('exist');
        cy.contains('2 results found for "baker"').should('exist');
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