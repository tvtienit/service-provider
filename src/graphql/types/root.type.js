import { query } from './query.type';
import { mutation } from './mutation.type';
import { subscription } from './subscription.type';
import _ from 'lodash';

const rootType = `
    type Auth {
        _id: ID,
        username: String,
        message: String
    }

    type Subscriber {
        _id: ID,
        userId: String,
        locationId: String,
    }

    type User {
        _id: ID,
        username: String,
        email: String,
        nickname: String,
        phone: String,
        registration_date: String,
        registered: Host,
        reviews: [Review]
    }

    type Host {
        _id: ID,
        user: User,
        phone: String,
        location: Location
    }

    type Category {
        _id: ID,
        title: String,
        description: String,
        locations: [Location]
    }

    type Review {
        _id: ID,
        user: User,
        location: Location,
        stars: Int,
        content: String
    }

    type Location {
        _id: ID,
        title: String,
        description: String,
        category: Category,
        city: String,
        img_source: String,
        address: String,
        lat: Float,
        long: Float,
        price: Float,
        host: Host,
        reviews: [Review],
        is_inspected: Boolean
    }
`;

exports.RootType = rootType.concat(query, mutation, subscription);