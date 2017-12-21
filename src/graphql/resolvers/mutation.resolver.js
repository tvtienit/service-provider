import * as model from '../models';
import lds from 'lodash';
import removeProperty from 'js-remove-property';
import { isGuestResolver } from './guest.resolver';
import { isAdminResolver } from './admin.resolver';
import { isAuthenticatedResolver } from './auth.resolver';
import { pubsub } from './../../utils/pubsub';
import { REQUEST_SERVICE } from './../../constants/trigger';
import { nss } from '../../utils/database';
const isEmail = require('validator/lib/isEmail');

const {
    createToken,
    encryptPassword,
    comparePassword
} = require('../../utils/auth');

let mutations = {};

//region functionals
const userByObj = (userId) => {
    return model.User.findOne({ _id: userId }).exec();
};

const search = (model, words, options) => {
    return model
        .find({ $text: { $search: words }, ...options })
        .sort({ createdAt: -1 })
        .exec();
}

const paginate = (model, options, page, limit) => {
    page = (!page) ? 1 : page;
    limit = (!limit) ? 10 : limit;
    return model.paginate(options, {
        page: page,
        limit: limit,
        sort: { created_at: -1 },
    }).then(result => result.docs);
}

const registerHost = (userId) => {
    return model.User.findOne({ _id: userId }, { new: true }).exec((err, user) => {
        user.is_registered = true;
        user.save();
        return user;
    });
};

const subscribes = isAuthenticatedResolver.createResolver(
    async(_, params, { user }) => {
        const eSub = await model.Subscriber.findOne({ userId: user.id, locationId: params.locationId }).exec();
        const eLoc = await model.Location.findOne({ _id: params.locationId }).exec();
        const eHost = await model.Host.findOne({ _id: eLoc.hostId }).exec();
        if (eSub) {
            throw new Error("You've subscribed this location before");
        } else if (eHost.userId === user.id) {
            throw new Error("Cannot subscribe location that you're hosting");
        } else {
            const nSub = await model.Subscriber.create({
                userId: user.id,
                locationId: params.locationId
            });

            pubsub.publish(REQUEST_SERVICE, { requestService: nSub });
            return nSub;
        }
    }
);

mutations = {...mutations, subscribes };
//endregion

//region user
const searchUsers = (_, { words }) => {
    return search(model.User, words);
};

const users = (_, { page, limit }) => {
    return paginate(model.User, {}, page, limit);
};

const profile = isAuthenticatedResolver.createResolver(
    (_, params, { user }) => {
        return model.User.findOne({ _id: user.id }).exec();
    }
);

const register = isGuestResolver.createResolver(
    (root, args, context) => {
        return new Promise((resolve, reject) => {
            if (!args.user.email) {
                return reject({
                    name: 'email.empty',
                    message: 'Email is required'
                });
            } else if (!isEmail(args.user.email)) {
                return reject({
                    name: 'email.invalid',
                    message: 'Invalid email. Please try again!'
                });
            }

            if (!args.user.password) {
                return reject({
                    name: 'password.empty',
                    message: 'Password is required'
                });
            }

            if (!args.user.username) {
                return reject({
                    name: 'username.empty',
                    message: 'Username is required'
                });
            }

            return encryptPassword(args.user.password, (err, hash) => {
                if (err) {
                    return reject(new Error('The password could not be hashed.'));
                }

                model.User.create(Object.assign(args.user, { password: hash }))
                    .then((user) => {
                        resolve(createToken({ id: user._id, username: user.username }));
                    })
                    .catch((err2) => {
                        if (err2.code === 11000) {
                            return reject({
                                name: 'user.exists',
                                message: 'Dupplicated user information'
                            });
                        }

                        return reject(err2);
                    });
            });
        }).then(token => token);
    }
);

const login = isGuestResolver.createResolver(
    (root, args, context) => {
        return new Promise((resolve, reject) => {
            // Validate the data
            if (!args.username) {
                return reject({
                    name: 'username.empty',
                    message: 'Username is required.'
                });
            }
            if (!args.password) {
                return reject({
                    name: 'password.empty',
                    message: 'Password is required'
                });
            }

            // Find the user
            return model.User.findOne({ username: args.username })
                .exec()
                .then((user) => {
                    if (!user) {
                        return reject({
                            name: 'user.not_found',
                            message: 'Wrong Username. Please try again!'
                        });
                    }

                    return comparePassword(user.password, args.password, (err, isMatch) => {
                        if (err) { return reject(err); }
                        if (!isMatch) {
                            return reject({
                                name: 'password.wrong',
                                message: 'Wrong password. Please try again!'
                            });
                        }

                        resolve(createToken({ id: user._id, username: user.username }));
                    });
                })
                .catch(err => reject(err));
        }).then(token => token);
    }
);
mutations = {...mutations, login, register, profile, users, searchUsers };
//endregion

//region host
const registerService = isAuthenticatedResolver.createResolver(
    async(_, { service }, { user }) => {
        const uObj = await userByObj(user.id);
        if (uObj.is_registered)
            throw new Error("You've become a host before");

        service.userId = user.id;
        registerHost(user.id);
        return model.Host.create(service);
    }
);

const searchHosts = (_, { words }) => search(model.Host, words);
mutations = {...mutations, registerService, searchHosts };
//endregion

//region category
const addCategory = isAdminResolver.createResolver(
    (_, { category }, context) => {
        return model.Category.create(category);
    }
);

const updateCategory = isAdminResolver.createResolver(
    (_, { categoryId, category }, context) => {
        return model.Category.findByIdAndUpdate(categoryId, category, { new: true }).exec();
    }
);

const deleteCategory = isAdminResolver.createResolver(
    (_, { categoryId }, context) => model.Category.findByIdAndRemove(categoryId).exec()
);

const searchCategories = (_, { words }, context) => {
    return search(model.Category, words);
};
mutations = {...mutations, addCategory, updateCategory, deleteCategory, searchCategories };
//endregion

//region review
const rate = isAuthenticatedResolver.createResolver(
    async(_, { review }, { user }) => {
        if (await model.Review.findOne({ userId: user.id }) != null)
            throw new Error("You've reviewed this location before");
        review.userId = user.id;
        return model.Review.create(review);
    }
);
mutations = {...mutations, rate };
//endregion

//region location
const addLocation = isAuthenticatedResolver.createResolver(
    (_, { location }, { user }) => {
        return model.Location.create(location);
    }
);

const deleteLocation = isAuthenticatedResolver.createResolver(
    async(_, { locationId }, { user }) => {
        const currentHost = await model.Host.findOne({userId: user.id}).exec();
        const currentLocation = await model.Location.findOne({_id: locationId, hostId: currentHost._id}).exec();
        if (!currentLocation) 
            throw new Error("You're not this location's owner");
        await model.LocationDraft.remove({ locationId: locationId }, (err) => {
            if (err) throw err;
        });
        return model.Location.findByIdAndRemove(locationId).exec();
    }
);

const deleleAllLocations = isAdminResolver.createResolver(
    async(_, {}, { user }) => {
        await model.Location.remove({});
        return "OK";
    }
);

const inspect = isAdminResolver.createResolver(
    (_, { locationId }, context) => {
        return model.Location.findByIdAndUpdate(locationId, { is_inspected: true }, { new: true }).exec();
    }
);

const searchInspected = (_, { words }) => search(model.Location, words, { is_inspected: true });
const searchUninspected = (_, { words }) => search(model.Location, words, { is_inspected: false });
const searchDrafts = (_, { words }) => search(model.LocationDraft, words);

const undoInspection = isAdminResolver.createResolver(
    (_, { locationId }, context) => {
        return model.Location.findByIdAndUpdate(locationId, { is_inspected: false }, { new: true }).exec();
    }
);

const updateLocation = isAuthenticatedResolver.createResolver(
    async(_, { locationId, location }, { user }) => {
        const currentHost = await model.Host.findOne({userId: user.id}).exec();
        const currentLocation = await model.Location.findOne({_id: locationId, hostId: currentHost._id}).exec();
        if (!currentLocation) 
            throw new Error("You're not this location's owner");
        location.realId = locationId;
        location.hostId = null;
        return model.LocationDraft.create(location);
    }
);

const inspectUpdation = isAdminResolver.createResolver(
    async(_, { draftId }) => {
        const currentDraft = await model.LocationDraft.findOne({ _id: draftId }, '-_id').exec();
        if (!currentDraft) throw new Error('Draft not found');
        const updated = await model.Location.findByIdAndUpdate(currentDraft.realId, currentDraft, { new: true }).exec();
        await model.LocationDraft.findByIdAndRemove(draftId);
        return updated;
    }
);
mutations = {...mutations, addLocation, inspect, undoInspection, updateLocation, inspectUpdation, deleteLocation, deleleAllLocations, searchInspected, searchUninspected, searchDrafts };
//endregion

exports.mutations = {
    Mutation: {...mutations }
}