import users from '../fixtures/users.json';

describe('sign in', () => {
  it('passes', () => {
    cy.visit('/');
    cy.contains('Sign in').click();
    cy.url().should('include', '/sign-in');
    cy.get('ion-input[type=email').type(users.Kait.email);
    cy.get('ion-input[type=password').type(`${users.Kait.password}{enter}`);
    cy.get('ion-button[type=submit').click();
    cy.url().should('include', '/');
cy.wait(5000);
    cy.contains('Wishlist').click({ force: true });
    cy.url().should('include', '/wishlist');
  });
});
