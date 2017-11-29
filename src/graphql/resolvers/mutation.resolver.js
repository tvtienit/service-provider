import * as model from '../models';
import { isGuestResolver } from './guest.resolver';
import { isAdminResolver } from './admin.resolver';
import { isAuthenticatedResolver } from './auth.resolver';

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
    return userModel.findOne({ _id: userId }, { new: true }).exec((err, user) => {
        user.is_registered = true;
        user.save();
        return user;
    });
};
//endregion

//region user
const register = isGuestResolver.createResolver(
    (root, args, context) => {
        return new Promise((resolve, reject) => {
            if (!args.user.email) {
                return reject({
                    name: 'email.empty',
                    message: 'Email is empty.'
                });
            } else if (!isEmail(args.user.email)) {
                return reject({
                    name: 'email.invalid',
                    message: 'You have to provide a valid email.'
                });
            }

            if (!args.user.password) {
                return reject({
                    name: 'password.empty',
                    message: 'You have to provide a password.'
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
                    message: 'Username is empty.'
                });
            }
            if (!args.password) {
                return reject({
                    name: 'password.empty',
                    message: 'You have to provide a password.'
                });
            }

            // Find the user
            return model.User.findOne({ username: args.username })
                .exec()
                .then((user) => {
                    if (!user) {
                        return reject({
                            name: 'user.not_found',
                            message: 'Authentication failed. User not found.'
                        });
                    }

                    return comparePassword(user.password, args.password, (err, isMatch) => {
                        if (err) { return reject(err); }
                        if (!isMatch) {
                            return reject({
                                name: 'password.wrong',
                                message: 'Wrong password.'
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
            throw new Error('User has registered a service before');

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
    (_, review, { user }) => {
        params.userId = user.id;
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