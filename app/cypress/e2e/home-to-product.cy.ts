import 'cypress-network-idle';

describe('visit home', () => {
  it('passes', () => {
    cy.visit('/home');
/*
    cy.get('.product-card').find('img').first().click();
    cy.waitForNetworkIdlePrepare({
      method: 'GET',
      pattern: 'products/frontend/*',
      alias: 'api',
    });
    cy.waitForNetworkIdle('@api', 1000);

    cy.url().should('match', /products\?prod_id=\d+/);

    cy.contains('only in stock', { matchCase: false }).should('exist');
    cy.waitForNetworkIdle('@api', 1000);

    cy.get('i[class*="in-stock-box"]').then($inStock => {
      cy.get('button[class*="only-in-stock"]').click({
        force: true,
      });
      cy.waitForNetworkIdle('@api', 1000);

      cy.get('i[class*="in-stock-box"]').should('have.length', $inStock.length);
    });*/
  });
});
