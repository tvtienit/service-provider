import { ForbiddenError } from './auth.resolver';
import { baseResolver } from './base.resolver';
import Permission from '../../constants/permission';

export const isGuestResolver = baseResolver.createResolver(
    // Extract the user from context (undefined if non-existent)
    (root, args, { permission }) => {
        if (permission != Permission.GUEST) throw new ForbiddenError();
    }
);