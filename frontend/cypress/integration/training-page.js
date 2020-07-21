describe('Training Page', () => {
  it('displays training details', () => {
    cy.visit('/training/61');
    cy.contains('Welding Technology/ Welder').should('exist');
    cy.contains('www.mcts.edu').should('exist');
    cy.contains('13 months to 2 years to complete').should('exist');
    cy.contains(
      '"This course consists of ten 36-hour units of instruction containing 4 ' +
      'units of theory and 6 units of lab. The first semester requires two three hour ' +
      'evenings per week, one of theory and one of lab. The following 36-hour units of ' +
      'instruction will be taken in the sequence indicated. Each unit consists of ' +
      'twelve, three hour sessions."'
    ).should('exist');
    cy.contains(
      'Career Track: Welders, Cutters, Solderers, and Brazers, ' +
      'Welding, Soldering, and Brazing Machine Setters, Operators, and Tenders'
    ).should('exist');
  });
});