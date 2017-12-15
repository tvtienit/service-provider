import { combineResolvers } from 'apollo-resolvers';
import { queries } from './query.resolver';
import { mutations } from './mutation.resolver';
import { isUndefined } from 'lodash';
import { filterFields } from './field.resolver';
import { subscriptions } from './subscription.resolver';

const resolvers = combineResolvers([
    filterFields,
    queries,
    mutations,
    subscriptions
]);

exports.resolvers = resolvers;