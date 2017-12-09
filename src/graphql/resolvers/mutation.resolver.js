import * as model from '../models';
import lds from 'lodash';
import { isGuestResolver } from './guest.resolver';
import { isAdminResolver } from './admin.resolver';
import { isAuthenticatedResolver } from './auth.resolver';
import { pubsub } from './../../utils/pubsub';
import { REQUEST_SERVICE } from './../../constants/trigger';

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
        if (eSub) {
            throw new Error("You've subscribed this location before");
        } else if (eLoc.hostId === user.id) {
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
mutations = {...mutations, login, register };
//endregion

//region host
const registerService = isAuthenticatedResolver.createResolver(
    async(_, { service }, { user }) => {
        const uObj = await userByObj(user.id);
        if (uObj.is_registered)
            throw new Error('Bạn đã đăng kí dịch vụ với chúng tôi');

        service.userId = user.id;
        registerHost(user.id);
        return model.Host.create(service);
    }
);
mutations = {...mutations, registerService };
//endregion

//region category
const addCategory = isAdminResolver.createResolver(
    (_, { category }, context) => {
        console.log(category);
        return model.Category.create(category);
    }
);
mutations = {...mutations, addCategory };
//endregion

//region review
const rate = isAuthenticatedResolver.createResolver(
    async(_, { review }, { user }) => {
        if (await model.Review.findOne({ userId: user.id }) != null)
            throw new Error("Bạn đã cho ý kiến về địa điểm này");
        review.userId = user.id;
        return model.Review.create(review);
    }
);
mutations = {...mutations, rate };
//endregion

//region location
const addLocation = isAdminResolver.createResolver(
    (_, { location }, context) => {
        return model.Location.create(location);
    }
);
mutations = {...mutations, addLocation };
//endregion

exports.mutations = {
    Mutation: {...mutations }
}