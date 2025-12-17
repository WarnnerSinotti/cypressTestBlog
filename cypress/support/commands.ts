declare global {
    namespace Cypress {
        interface Chainable {
            accessHomePage(): typeof accessHomePage;
        }
    }
}

export const accessHomePage = () => {
    cy.intercept('POST', 'https://y.clarity.ms/collect').as('clarityCollect');

    cy.visit('/');

    cy.wait('@clarityCollect').its('response.statusCode').should('eq', 204);
};
