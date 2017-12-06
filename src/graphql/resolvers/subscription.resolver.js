import { PubSub } from 'graphql-subscriptions';
import * as model from '../models';
import { REQUEST_SERVICE } from './../../constants/trigger';

let subscriptions = {};
const pubsub = new PubSub();

const requestService = () => {
    return {
        subscribe: () => pubsub.asyncIterator(REQUEST_SERVICE)
    };
};
subscriptions = {...subscriptions, requestService };

exports.subscriptions = {
    Subscription: {...subscriptions }
};