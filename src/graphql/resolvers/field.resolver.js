import * as model from '../models';

const filters = {
    User: {
        registered: (_) => {
            return model.Host.findOne({ userId: _._id }).exec();
        },
        reviews: (_) => {
            return model.Review.find({ userId: _._id }).exec();
        }
    },
    Host: {
        location: (_) => {
            return model.Location.findOne({ hostId: _._id }).exec();
        }
    },
    Review: {
        user: (_) => {
            return model.User.findOne({ _id: _.userId }).exec();
        },
        location: (_) => {
            return model.Location.findOne({ _id: _.locationId }).exec();
        }
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
        }
    }
};

exports.filterFields = {
    ...filters
}