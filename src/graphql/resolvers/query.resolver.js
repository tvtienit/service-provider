import * as model from '../models';
import { verifyToken } from '../../utils/auth';

let queries = {};

//region user
const users = () => {
    return model.User.find({}).exec();
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

const categories = () => model.Category.find({}).exec();

const categoryById = (_, { categoryId }) => model.Category.findOne({ _id: categoryId }).exec();
queries = {...queries, categoriesByCity, categories, categoryById };
//endregion

//region location
const locationsByCity = (_, { city, page, limit }) => {
    page = (!page) ? 1 : page;
    limit = (!limit) ? 10 : limit;
    return model.Location.paginate({ city: city, is_inspected: true }, {
        page: page,
        limit: limit,
        sort: { created_at: -1 },
    }).then(result => result.docs);
};

const locationById = (_, { locationId }) => model.Location.findOne({ _id: locationId }).exec();

const inspectedLocations = () => {
    return model.Location.find({ is_inspected: true }).exec();
};

const unInspectedLocations = () => {
    return model.Location.find({ $or: [{ is_inspected: false }, { is_inspected: null }] }).exec();
};

const locationDrafts = () => {
    return model.LocationDraft.find({}).exec();
}

queries = {...queries, locationsByCity, inspectedLocations, unInspectedLocations, locationDrafts, locationById };
//endregion

exports.queries = {
    Query: {...queries }
};