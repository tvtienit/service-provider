import { combineResolvers } from 'apollo-resolvers';
import { queries } from './query.resolver';
import { mutations } from './mutation.resolver';
import { isUndefined } from 'lodash';
import { filterFields } from './field.resolver';

const resolvers = combineResolvers([
    filterFields,
    queries,
    mutations
]);

exports.resolvers = resolvers;