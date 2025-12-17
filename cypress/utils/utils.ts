import { faker } from '@faker-js/faker';

interface FakeDataUtilsInterface {
    GetSearchKeyword(): string;
}

export const fakeData: FakeDataUtilsInterface = {
    GetSearchKeyword() {
        return faker.word.noun();
    },
};
