import * as model from '../models';
import { verifyToken } from '../../utils/auth';
import { isAuthenticatedResolver } from './auth.resolver';

let queries = {};

const paginate = (model, options, page, limit) => {
    page = (!page) ? 1 : page;
    limit = (!limit) ? 10 : limit;
    return model.paginate(options, {
        page: page,
        limit: limit,
        sort: { created_at: -1 },
    }).then(result => {
        if (!options.categoryId)
            result.docs.push({pages: result.pages});
        return result.docs;
    });
}

//region user
const users = (_, { page, limit }) => {
    return paginate(model.User, {}, page, limit);
};

const firstByUsername = (root, params) => {
    return model.User.findOne({ username: params.username }).exec();
};

const extract = async(root, params) => {
    const extracted = await verifyToken(params.token);
    return extracted.exp < Math.floor(Date.now() / 1000) ? { message: "expired" } : extracted;
};
queries = {...queries, users, firstByUsername, extract };
//endregion

//region category
const categoriesByCity = async(_, { cgrId, city, page, limit }, context) => {
    const option = (cgrId) ? { _id: cgrId } : {};
    const result = await model.Category.find(option).exec();
    for (var i = 0; i < result.length; i++) {
        result[i].locations = await locationsByCity(_, {cgrId: result[i]._id, city, page, limit});
    }

    return result;
};

const categories = (_, { page, limit }) => {
    return paginate(model.Category, {}, page, limit);
};

const categoryById = (_, { categoryId }) => model.Category.findOne({ _id: categoryId }).exec();
queries = {...queries, categoriesByCity, categories, categoryById };
//endregion

//region location
const locationsByCity = async(_, { cgrId, city, page, limit }) => {
    let options = { city: city, is_inspected: true };
    if (cgrId) {
        options = {...options, categoryId: cgrId};
    }
    return paginate(model.Location, options, page, limit);;
};

const locationsByHost = isAuthenticatedResolver.createResolver(
    async(_, params, { user }) => {
        const currentHost = await model.Host.findOne({ userId: user.id }).exec();
        if (!currentHost)
            throw new Error("You have to become a host first");
        
        return model.Location.find({hostId: currentHost._id}).exec();
    }
);

const locationById = (_, { locationId }) => model.Location.findOne({ _id: locationId }).exec();

const inspectedLocations = (_, { page, limit }) => {
    return paginate(model.Location, { is_inspected: true }, page, limit);
};

const unInspectedLocations = (_, { page, limit }) => {
    return paginate(model.Location, { $or: [{ is_inspected: false }, { is_inspected: null }] }, page, limit);
};

const locationDrafts = (_, { page, limit }) => {
    return paginate(model.LocationDraft, {}, page, limit);
}

queries = {...queries, locationsByCity, inspectedLocations, unInspectedLocations, locationDrafts, locationById, locationsByHost };
//endregion

//region notification
const unreadNotifications = isAuthenticatedResolver.createResolver(
    async(_, params, { user }) => {
        const host = await model.Host.findOne({ userId: user.id }).exec(); 
        const locations = await model.Location.find({ hostId: host._id }).exec();
        return model.Subscriber
                    .find({ locationId: { $in : locations.map(loc => loc._id) } })
                    .exec()
                    .then((subIds) => {
                        return model.Notification.find({ subId: { $in: subIds.map(_=>_.id) }, status: false }).exec();
                    }).catch(err => { throw err });
    }
);
queries = {...queries, unreadNotifications};
//endregion

exports.queries = {
    Query: {...queries }
};