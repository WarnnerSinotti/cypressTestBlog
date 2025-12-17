import { api } from '../../utils/configurationCypress';

declare global {
    namespace Cypress {
        interface Chainable {
            apiCadastrarConta(name: string, email: string, password: string): Chainable<string>;
        }
    }
}

const baseUrl = Cypress.env('BASE_URL');
const lexioToken = Cypress.env('LEXIO_TOKEN_API');

export const apiCadastrarConta = (name: string, email: string, password: string) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);

    cy.api({
        method: 'POST',
        url: `${baseUrl}/cadastro/new/`,
        headers: {
            Authorization: `Bearer ${lexioToken}`,
            'Content-Type': 'multipart/form-data',
        },
        timeout: api.timeout,
        body: formData,
        failOnStatusCode: false,
    }).then((response) => {
        return response;
    });
};
