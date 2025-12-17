import { accessHomePage } from './commands';

//Plugins and External API
Cypress.Commands.add('accessHomePage', accessHomePage);

//Ignorar error
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
});
