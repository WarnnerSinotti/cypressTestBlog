import { time } from 'cypress/utils/configurationCypress';

declare global {
    namespace Cypress {
        interface Chainable {
            accessHomePage(): typeof accessHomePage;
        }
    }
}

export const accessHomePage = () => {
    // cy.intercept('POST', 'https://y.clarity.ms/collect').as('clarityCollect');

    cy.visit('/');

    cy.wait(time.threeSeconds);
    cy.get('[data-ast-blocks-layout="true"]').should('be.visible');
    //  cy.wait('@clarityCollect').its('response.statusCode').should('eq', 204);
};
