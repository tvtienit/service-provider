import { createError } from 'apollo-errors';
import { baseResolver } from './base.resolver';

export const AdminRequiredError = createError('AdminRequiredError', {
    message: 'Only admin can do this'
});

export const ForbiddenError = createError('ForbiddenError', {
    message: 'You are logged in'
});

export const AuthenticationRequiredError = createError('AuthenticationRequiredError', {
    message: 'You must be logged in to do this'
});

export const isAuthenticatedResolver = baseResolver.createResolver(
    // Extract the user from context (undefined if non-existent)
    (root, args, { user }) => {
        console.log(user);
        if (!user) throw new AuthenticationRequiredError();
    }
);