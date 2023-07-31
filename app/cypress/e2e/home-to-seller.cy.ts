describe('template spec', () => {
  it('passes', () => {
    cy.visit('/home');
    cy.wait(2000);

    cy.contains('Merchants').click({ force: true });
    cy.wait(2000);
    cy.contains('Amazon').click({ force: true });
    cy.url().should('include', '/seller-details');

  })
})