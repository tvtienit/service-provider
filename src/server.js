const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const assert = require('assert');
const { apolloExpress, graphiqlExpress } = require('apollo-server');

const { server, client, database, admin } = require('./config/config');
const { schema } = require('./graphql');
const { getTokenFromRequest, verifyToken } = require('./utils/auth');

import Permission from './constants/permission';
import { createExpressContext } from 'apollo-resolvers';
import { formatError as apolloFormatError, createError } from 'apollo-errors';
import { GraphQLError } from 'graphql';

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${database.host}:${database.port}/${database.name}`, (err, db) => {
    assert.equal(null, err);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('MongoDB\'s connected'));

const app = express();

const UnknownError = createError('UnknownError', {
    message: 'An error has occurred.'
});

/**
 * Global error
 * @param {*} error: Error details that occurred
 */
const formatError = error => {
    let e = apolloFormatError(error);
    if (e instanceof GraphQLError) {
        e = apolloFormatError(new UnknownError({
            data: {
                originalMessage: e.message,
                originalError: e.name
            }
        }));
    }

    return e;
};

/**
 * Middleware for authorizarion
 */
const isAuth = async(req) => {
    const token = getTokenFromRequest(req);
    //console.log(token);
    if (!token) {
        req.user = null;
        req.permission = Permission.GUEST;
    } else {
        try {
            req.user = await verifyToken(token);
            if (req.user.exp < Math.floor(Date.now() / 1000)) { // Token has expired
                req.user = null;
                req.permission = Permission.GUEST;
                console.log('token has expired');
            } else {
                if (req.user.username == admin.username) {
                    req.permission = Permission.ADMIN;
                } else {
                    req.permission = Permission.USER;
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    req.next();
}

/**
 * Set up origin for cors
 */
var corsOptions = { origin: `${client.host}/${client.port}` };

app.use(cors(corsOptions));
app.use(isAuth);

app.post('/graphql', bodyParser.json(), apolloExpress((request, response) => {
    const user = request.user;
    const permission = request.permission;
    const context = createExpressContext({
        user,
        permission
    }, response);

    return {
        schema,
        formatError,
        context
    };
}));

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(server.port, () => console.log(`Now browse to ${server.host}:${server.port}/graphiql`));

module.exports = app;