import users from '../fixtures/users.json';

describe('sign in', () => {
  it('passes', () => {
    cy.visit('/');
    cy.contains('Sign in').click({ force: true });
    cy.url().should('include', '/sign-in');
    cy.get('ion-input[type=email').type(users.Amazon.email);
    cy.get('ion-input[type=password').type(`${users.Amazon.password}{enter}`);
    cy.get('ion-button[type=submit').click();
    cy.url().should('include', '/inventory');
    cy.wait(5000);
    cy.contains('Insights').click({ force: true });
    cy.url().should('include', '/sales');
    
    cy.wait(500);
    cy.contains('Analytics').click({ force: true });
    cy.url().should('include', '/product-analytics');

    cy.wait(500);
    cy.contains('Sign out').click({ force: true });
    cy.url().should('include', '/sign-out');

    cy.wait(6000)
    cy.url().should('include', '/home');
  });
});
