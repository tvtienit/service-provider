import * as model from '../models';
import { REQUEST_SERVICE } from './../../constants/trigger';
import { pubsub } from './../../utils/pubsub';
import { withFilter } from 'graphql-subscriptions';
import { verifyToken } from '../../utils/auth';

let subscriptions = {};
const requestService = {
    subscribe: withFilter(() => pubsub.asyncIterator(REQUEST_SERVICE),
        async(payload, args) => {
            // ToDo: Notify host of subscribed location
            let user = null;
            try {
                user = await verifyToken(args.token);
            } catch(err) { throw err }

            if (!user) return;
            const sub = await model.Subscriber.findOne({ _id: payload.requestService.subId }).exec();
            const host = await model.Host.findOne({ userId: user.id }).exec();
            const location = await model.Location.findOne({ _id: sub.locationId }).exec();   
            return host._id == location.hostId;
        }
    )
};
subscriptions = {...subscriptions, requestService };

exports.subscriptions = {
    Subscription: {...subscriptions }
};