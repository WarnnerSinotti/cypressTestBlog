import { assertionGlobal } from 'cypress/assertions/global';
import { assertionHome } from 'cypress/assertions/home';
import { homePage } from 'cypress/pageObjects/home';
import { textStaticHomePage } from 'cypress/utils/textStatic/textStaticHomePage';
import { fakeData } from 'cypress/utils/utils';

describe('HomePage', () => {
    const searchKey = fakeData.GetSearchKeyword();

    beforeEach(() => {
        cy.accessHomePage();
        assertionHome.SearchFormIconBeVisible();
    });
    it('AG-02A Acessar homepage e validar campo de busca de search "Lupa" e cancelar acao', () => {
        homePage.ProcurandoArquivo(searchKey, true);
    });
    it('AG-02A Acessar homepage e validar campo de busca de search "Lupa" e acessar palavra chave', () => {
        homePage.ProcurandoArquivo(searchKey);
        assertionGlobal.Route(`/?s=${searchKey}`);
        assertionHome.Title(`${textStaticHomePage.blog.result}${searchKey}`, 'h1');
    });
});
