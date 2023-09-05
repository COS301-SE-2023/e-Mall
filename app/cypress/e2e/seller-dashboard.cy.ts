// import users from '../fixtures/users.json';

// describe('sign in', () => {
//   it('passes', () => {
//     cy.visit('/');
//     cy.contains('Sign in').click({ force: true });
//     cy.url().should('include', '/sign-in');
//     cy.wait(2000);
//     cy.get('ion-input[type=email').type(users.Amazon.email);
//     cy.get('ion-input[type=password').type(`${users.Amazon.password}{enter}`);
//     cy.get('ion-button[type=submit').click();
//     cy.wait(5000);
//     cy.url().should('include', '/inventory');
//     cy.wait(5000);
//     cy.contains('Analytics').click({ force: true });
//     cy.url().should('include', '/sales');
//     cy.wait(5000);
//     cy.contains('Settings').click({ force: true });
//     cy.url().should('include', '/seller-dashboard-settings');

//     // cy.wait(1000);
//     // cy.contains('Compare').click({ force: true });
//     // cy.url().should('include', '/product-analytics');

//     cy.wait(500);
//     cy.contains('Sign out').click({ force: true });
//     // cy.url().should('include', '/sign-out');

//     cy.wait(500);
//     cy.url().should('include', '/home');
//   });
// });
