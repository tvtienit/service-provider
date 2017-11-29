import * as model from '../models';

let queries = {};

//region user
const users = () => {
    return model.User.find({}).exec();
};

const firstByUsername = (root, params) => {
    return model.User.findOne({ username: params.username }).exec();
};
queries = {...queries, users, firstByUsername };
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
queries = {...queries, categoriesByCity };
//endregion

//region location
const locationsByCity = (_, { city, page, limit }) => {
    page = (!page) ? 1 : page;
    limit = (!limit) ? 10 : limit;
    return model.Location.paginate({ city: city }, {
        page: page,
        limit: limit,
        sort: { created_at: -1 },
    }).then(result => result.docs);
};
queries = {...queries, locationsByCity };
//endregion

exports.queries = {
    Query: {...queries }
};