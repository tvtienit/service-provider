import * as model from '../models';
import lds from 'lodash';

const filters = {
    Auth: {
        _id: (_) => _.id
    },
    User: {
        registered: (_) => {
            return model.Host.findOne({ userId: _._id }).exec();
        },
        reviews: (_) => {
            return model.Review.find({ userId: _._id }).exec();
        },
        registration_date: (_) => (
            _.createdAt.toISOString()
            .replace(/T/, ' ')
            .replace(/\..+/, '')
        ),
        subLocations: async(_) => {
            const allSubs = await model.Subscriber.find({ userId: _._id }).exec();
            const subLocs = lds.forEach(allSubs, async(sub) => {
                return await model.Location.findOne({ _id: sub.locationId }).exec();
            });

            return subLocs;
        },
    },
    Category: {
        locations: (_) => _.locations ? _.locations : model.Location.find({ categoryId: _.id }).exec()
    },
    Host: {
        location: (_) => {
            return model.Location.find({ hostId: _._id }).exec();
        }
    },
    Review: {
        user: (_) => {
            return model.User.findOne({ _id: _.userId }).exec();
        },
        location: (_) => {
            return model.Location.findOne({ _id: _.locationId }).exec();
        },
        date: (_) => (
            _.createdAt.toISOString()
            .replace(/T/, ' ')
            .replace(/\..+/, '')
        )
    },
    Location: {
        category: (_) => {
            return model.Category.findOne({ _id: _.categoryId }).exec();
        },
        host: (_) => {
            return model.Host.findOne({ _id: _.hostId }).exec();
        },
        reviews: (_) => {
            return model.Review.find({ locationId: _._id }).exec();
        },
        is_inspected: (_) => (!_.is_inspected) ? false : _.is_inspected,
        subscribers: async(_) => {
            const allSubs = await model.Subscriber.find({ locationId: _._id }).exec();
            const subUsers = lds.forEach(allSubs, async(sub) => {
                return await model.User.findOne({ _id: sub.userId }).exec();
            });

            return subUsers;
        }
    },
    Subscriber: {
        user: (_) => model.User.findOne({ _id: _.userId }).exec(),
        location: (_) => model.Location.findOne({ _id: _.locationId }).exec(),
        notifications: (_) => model.Notification.find({ subId: _._id }).exec()
    },
    Notification: {
        date: (_) => (
            _.createdAt.toISOString()
            .replace(/T/, ' ')
            .replace(/\..+/, '')
        ),
        subscriber: (_) => model.Subscriber.findOne({ _id: _.subId }).exec()
    }
};

exports.filterFields = {
    ...filters
}