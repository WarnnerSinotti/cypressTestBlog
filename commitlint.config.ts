import { RuleConfigSeverity, type UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // Tipo do commit, obrigatório e com opções customizadas
        'type-enum': [
            RuleConfigSeverity.Error, // 2 = Error
            'always',
            ['feat', 'fix', 'docs', 'refactor', 'config'], // prefixos permitidos
        ],

        // Tamanho máximo do header (linha do commit)
        'header-max-length': [RuleConfigSeverity.Error, 'always', 150],
    },
};

export default Configuration;
