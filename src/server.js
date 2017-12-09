const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const assert = require('assert');
const { apolloExpress } = require('apollo-server');
const { schema } = require('./graphql');
const { getTokenFromRequest, verifyToken } = require('./utils/auth');
const { cfg } = require('./config/app');

import Permission from './constants/permission';
import {
    graphqlExpress,
    graphiqlExpress,
} from 'graphql-server-express';
import { createExpressContext } from 'apollo-resolvers';
import { formatError as apolloFormatError, createError } from 'apollo-errors';
import { GraphQLError, execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${cfg.DBHost}:${cfg.DBPort}/${cfg.DBName}`, (err, db) => {
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
    if (!token) {
        req.user = null;
        req.permission = Permission.GUEST;
    } else {
        try {
            req.user = await verifyToken(token);
            if (req.user.exp < Math.floor(Date.now() / 1000)) { // Token has expired
                req.user = null;
                req.permission = Permission.GUEST;
            } else {
                if (req.user.username == 'admin') {
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

if (process.env.NODE_ENV === 'development') {
    app.use('*', cors());
} else if (process.env.NODE_ENV === 'production') {
    /**
     * Set up origin for cors
     */
    const whitelist = cfg.CORsWhiteList.split(',');

    var corsOptions = {
        origin: function(origin, callback) {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    }
    app.use(cors(corsOptions));
}

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

if (process.env.NODE_ENV === 'development') {
    app.use('/graphiql', graphiqlExpress({
        endpointURL: '/graphql',
        subscriptionsEndpoint: `ws://localhost:${cfg.AppPort}/subscriptions`
    }));
}

app.get('*', function(req, res, next) {
    if (req.url === '/graphiql' && process.env.NODE_ENV === 'development') return next();
    res.status(404).end();
});

/**
 * Subscription Server
 */
const ws = createServer(app);
ws.listen(cfg.AppPort, () => {
    console.log(`GraphQL Server is now running on http://localhost:${cfg.AppPort}`);
    new SubscriptionServer({
        execute,
        subscribe,
        schema
    }, {
        server: ws,
        path: '/subscriptions',
    });
});

module.exports = app;