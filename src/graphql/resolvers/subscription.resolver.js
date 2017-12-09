import * as model from '../models';
import { REQUEST_SERVICE } from './../../constants/trigger';
import { pubsub } from './../../utils/pubsub';

let subscriptions = {};
const requestService = {
    subscribe: () => pubsub.asyncIterator(REQUEST_SERVICE)
};
subscriptions = {...subscriptions, requestService };

exports.subscriptions = {
    Subscription: {...subscriptions }
};