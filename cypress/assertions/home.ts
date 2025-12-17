import { CssType } from 'cypress/support/types/globalTypes';

interface AssertionHomeInterface {
    SearchFormIconBeVisible: () => void;
    Title: (text: string, type: CssType) => void;
}

export const assertionHome: AssertionHomeInterface = {
    SearchFormIconBeVisible: (): void => {
        cy.get('a[aria-label="Search button"]').should('be.visible');
    },

    Title: (text: string, type: CssType = 'h1'): void => {
        cy.get(type).should('contain.text', text);
    },
};
