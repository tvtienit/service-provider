const graphqlTools = require('graphql-tools');
const { types } = require('./types');
const { resolvers } = require('./resolvers');

const Schema = `
    schema {
        query: Query,
        mutation: Mutation,
        subscription: Subscription
    }
`;

exports.schema = graphqlTools.makeExecutableSchema({
    typeDefs: [
        Schema,
        ...types,
    ],
    resolvers
});