import { accessHomePage } from './commands';

// Commands WEB
Cypress.Commands.add('accessHomePage', accessHomePage);

//Plugins and External API

//Ignorar error
Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});
