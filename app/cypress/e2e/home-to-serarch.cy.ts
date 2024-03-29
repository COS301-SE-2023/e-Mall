/*import 'cypress-network-idle';

describe('visit home and search', () => {
  it('passes', () => {
    cy.visit('/home');
    cy.get('#mat-input-0').click({ force: true }).type('f').type('{enter}');
    cy.url().should('match', /search-results/);
    cy.waitForNetworkIdlePrepare({
      method: 'GET',
      pattern: 'products/backend/*',
      alias: 'api',
    });
    cy.waitForNetworkIdle('@api', 500);
    cy.get('app-product-card').should('have.length', 30);

   cy.contains('Brand')
      .click({ force: true })
      .then(() => {
        cy.contains('ONE').click({ force: true });
      });
    cy.get('app-product-card').should('have.length', 22);

    cy.contains('ONE').click({ force: true });
    cy.get('app-product-card').should('have.length', 30);

    cy.contains('Category')
      .click({ force: true })
      .then(() => {
        cy.contains('books').click({ force: true });
      });
    cy.get('app-product-card').should('have.length', 30);
    cy.contains('books').click({ force: true });
    cy.get('app-product-card').should('have.length', 30);

    cy.contains('Inventory')
      .click({ force: true })
      .then(() => {
        cy.contains('Show only in stock').click({ force: true });
      });
    cy.get('app-product-card').should('have.length', 29);
    cy.contains('Show only in stock').click({ force: true });
    cy.get('app-product-card').should('have.length', 29);

    cy.contains('Seller')
      .click({ force: true })
      .then(() => {
        cy.contains('Amazon').click({ force: true });
      });
    cy.get('app-product-card').should('have.length', 27);
    cy.contains('Amazon').click({ force: true });
    cy.get('app-product-card').should('have.length', 27);
  });
});
*/