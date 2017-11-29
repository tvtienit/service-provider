import { setupTest } from './__mocks__/helper';
import { schema } from '../src/graphql';
import { graphql } from 'graphql';
import { userModel } from '../src/graphql/models/user.model';
import { USER, ADMIN, GUEST } from '../src/constants/permission';

describe('Some queries', () => {
    beforeEach(async() => {
        await setupTest();
        await userModel.create({
            username: 'user',
            password: 'user',
            email: 'user@example.com',
            nickname: 'userAlso'
        });
    });

    it.only('should return all users from database', async() => {
        //language=GraphQL
        const query = `
        {
            users {
              username
              email
              nickname
            }
        }`;

        const result = await graphql(schema, query, null, null);
        const { data } = result;

        expect(data.users).toEqual(expect.arrayContaining([{
            "username": "user",
            "email": "user@example.com",
            "nickname": "userAlso"
        }]));
    });
});

describe('login feature', () => {
    it('should return a token if user successfully logins', async() => {
        //language=GraphQL
        const mutation = `
        mutation {
            login(username:"user", password:"user")
        }`;

        const context = { user: null, permission: GUEST };
        const result = await graphql(schema, mutation, {}, context);
        const { data } = result;

        expect(data.login).toBeInstanceOf(String);
    });

    it('should throw error \'User not found\' if username is wrong', async() => {
        //language=GraphQL
        const mutation = `
        mutation {
            login(username:"userWrong", password:"user")
        }`;

        const result = await graphql(schema, mutation, null, null);
        const { errors } = result;

        expect(errors.data.originalMessage).toBe('Authentication failed. User not found.');
    });
});