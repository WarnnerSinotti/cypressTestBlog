interface HomePageInterface {
    HomeBtn: () => void;
    ProcurandoArquivo: (text: string) => void;
}

export const homePage: HomePageInterface = {
    HomeBtn() {
        cy.get('a[aria-label="Search button"]').should('be.visible').realClick();

        return this;
    },

    ProcurandoArquivo: (text: string) => {
        homePage.HomeBtn();

        cy.get('.ast-search-menu-icon').invoke('addClass', 'ast-dropdown-active');

        cy.get('#search-field', { timeout: 20000 }).focus().should('be.visible').clear().type(text, { delay: 50 }).type('{enter}');
    },
};
