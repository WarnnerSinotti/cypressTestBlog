import { assertionGlobal } from 'cypress/assertions/global';
import { assertionHome } from 'cypress/assertions/home';

describe('HomePage', () => {
    beforeEach(() => {
        cy.accessHomePage();
    });
    it('AG-01A Acessar homepage e validar url', () => {
        assertionGlobal.Route('/');
    });
    it('AG-01B Acessar homepage e validar button de search "Lupa"', () => {
        assertionHome.SearchFormIconBeVisible();
    });
});
