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
    }).then(result => result.docs);
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
    const locations = await locationsByCity(_, { city, page, limit });
    const option = (cgrId) ? { _id: cgrId } : {};

    return model.Category.find(option).exec(async(err, cgrs) => {
        cgrs.forEach((cgr) => {
            cgr.locations = locations.filter(location =>
                location.categoryId == cgr._id);
        });

        return cgrs;
    });
};

const categories = (_, { page, limit }) => {
    return paginate(model.Category, {}, page, limit);
};

const categoryById = (_, { categoryId }) => model.Category.findOne({ _id: categoryId }).exec();
queries = {...queries, categoriesByCity, categories, categoryById };
//endregion

//region location
const locationsByCity = (_, { city, page, limit }) => {
    return paginate(model.Location, { city: city, is_inspected: true }, page, limit);
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

exports.queries = {
    Query: {...queries }
};