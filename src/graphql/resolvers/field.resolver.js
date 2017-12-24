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
        }
    },
    Category: {
        locations: (_, { city, page, limit }) => {
            let options = {categoryId: _._id};
            if (city) {
                options = {...options, city: city, is_inspected: true};
            }
            
            page = page ? page : 1;
            limit = limit ? limit : 10;
            return model.Location.paginate(options, {
                page: page,
                limit: limit,
                sort: { created_at: -1 },
            }).then(result => result.docs);
        }
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
    }
};

exports.filterFields = {
    ...filters
}