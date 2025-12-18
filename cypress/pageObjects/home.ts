import { time } from 'cypress/utils/configurationCypress';

interface HomePageInterface {
    HomeBtn: () => void;
    ProcurandoArquivo: (text: string, cancel?: boolean) => void;
}

export const homePage: HomePageInterface = {
    HomeBtn() {
        cy.get('a[aria-label="Search button"]').should('be.visible').click();

        return this;
    },

    ProcurandoArquivo: (text: string, cancel: boolean = false) => {
        homePage.HomeBtn();

        cy.get('.ast-search-menu-icon').invoke('addClass', 'ast-dropdown-active');

        if (cancel) {
            cy.get('#search-field', { timeout: 20000 }).focus().should('be.visible');
            cy.wait(time.milliseconds);
            homePage.HomeBtn();
            cy.get('#search-field', { timeout: 20000 }).should('not.be.visible');
        } else {
            cy.get('#search-field', { timeout: 20000 }).focus().should('be.visible').clear().type(text, { delay: 50 }).type('{enter}');
        }
    },
};
