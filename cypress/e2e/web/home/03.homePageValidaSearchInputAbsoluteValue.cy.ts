import { assertionGlobal } from 'cypress/assertions/global';
import { assertionHome } from 'cypress/assertions/home';
import { homePage } from 'cypress/pageObjects/home';

describe('HomePage', () => {
    const absoluteValue = 'financeira';

    beforeEach(() => {
        cy.accessHomePage();
        assertionHome.SearchFormIconBeVisible();
    });
    it('AG-03A Acessar homepage e validar campo de busca de search "Lupa" e com palavra chave', () => {
        homePage.ProcurandoArquivo(absoluteValue);

        assertionGlobal.Route(`/?s=${absoluteValue}`);
    });
});
