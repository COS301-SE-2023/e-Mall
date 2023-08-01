import users from '../fixtures/users.json';

describe('sign in', () => {
  it('passes', () => {
    cy.visit('/');
    cy.contains('Sign in').click();
    cy.url().should('include', '/sign-in');
    cy.get('ion-input[type=email').type(users.user1.email);
    cy.get('ion-input[type=password').type(`${users.user1.password}{enter}`);
    cy.get('ion-button[type=submit').click();
    cy.url().should('include', '/');
  });
});
