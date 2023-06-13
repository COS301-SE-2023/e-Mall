import users from '../fixtures/users.json';

describe('sign in', () => {
  it('passes', () => {
    cy.visit('/');
    cy.contains('Sign In').click();
    cy.url().should('include', '/sign-in');
    cy.get('input[id=email').type(users.user1.email);
    cy.get('input[id=password').type(`${users.user1.password}{enter}`);
    cy.url().should('include', '/home');
  });
});
