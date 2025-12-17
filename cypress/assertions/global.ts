interface AssertionGlobalInterface {
    Route: (routeUrl: string) => void;
}

export const assertionGlobal: AssertionGlobalInterface = {
    Route: (routeUrl: string): void => {
        cy.url().should('include', routeUrl);
    },
};
