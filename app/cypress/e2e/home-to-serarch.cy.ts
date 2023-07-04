import 'cypress-network-idle';

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
    cy.waitForNetworkIdle('@api', 1000);
    cy.get('img[class*="product-image"]').should('have.length', 10);

    cy.contains('Brand')
      .click({ force: true })
      .then(() => {
        cy.contains('ONE').click({ force: true });
      });
    cy.get('img[class*="product-image"]').should('have.length', 2);

    cy.contains('ONE').click({ force: true });
    cy.get('img[class*="product-image"]').should('have.length', 10);

    cy.contains('Category')
      .click({ force: true })
      .then(() => {
        cy.contains('books').click({ force: true });
      });
    cy.get('img[class*="product-image"]').should('have.length', 9);
    cy.contains('books').click({ force: true });
    cy.get('img[class*="product-image"]').should('have.length', 10);

    cy.contains('Inventory')
      .click({ force: true })
      .then(() => {
        cy.contains('Show only in stock').click({ force: true });
      });
    cy.get('img[class*="product-image"]').should('have.length', 9);
    cy.contains('Show only in stock').click({ force: true });
    cy.get('img[class*="product-image"]').should('have.length', 10);

    cy.contains('Seller')
      .click({ force: true })
      .then(() => {
        cy.contains('Amazon').click({ force: true });
      });
    cy.get('img[class*="product-image"]').should('have.length', 7);
    cy.contains('Amazon').click({ force: true });
    cy.get('img[class*="product-image"]').should('have.length', 10);
  });
});
